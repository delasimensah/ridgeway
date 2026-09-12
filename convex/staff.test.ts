import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import {
  asUser,
  errorCode,
  insertPerson,
  makeBackend,
  passwordAccountSecret,
} from "./test.setup";

describe("staff.getHome", () => {
  it("returns the staff home for a staff member", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });

    const home = await asUser(t, userId).query(api.staff.getHome, {});

    expect(home).toEqual({
      displayName: "Ama Boateng",
      organizationName: "Ridgeway Property Group",
    });
  });

  it("refuses a field worker", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });

    try {
      await asUser(t, userId).query(api.staff.getHome, {});
      throw new Error("expected getHome to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("refuses a signed-in person with no staff role", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "visitor@ridgeway.gh",
      displayName: "Kojo Owusu",
      role: null,
    });

    try {
      await asUser(t, userId).query(api.staff.getHome, {});
      throw new Error("expected getHome to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });
});

describe("staff office people", () => {
  it("lets signed-in staff add another office person who can see staff screens", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });

    const profileId = await asUser(t, staff.userId).action(api.staff.create, {
      displayName: "Efua Mensah",
      email: "efua.mensah@ridgeway.gh",
      password: "RidgewayOffice26",
    });

    const loaded = await asUser(t, staff.userId).query(api.staff.get, {
      profileId,
    });
    expect(loaded).toMatchObject({
      _id: profileId,
      displayName: "Efua Mensah",
      email: "efua.mensah@ridgeway.gh",
      hasLogin: true,
    });

    const list = await asUser(t, staff.userId).query(
      api.staff.listForStaff,
      {}
    );
    expect(list).toEqual(
      expect.arrayContaining([
        {
          _id: staff.profileId,
          displayName: "Ama Boateng",
          email: "ama.boateng@ridgeway.gh",
          hasLogin: true,
        },
        {
          _id: profileId,
          displayName: "Efua Mensah",
          email: "efua.mensah@ridgeway.gh",
          hasLogin: true,
        },
      ])
    );

    const newUserId = await t.run(async (ctx) => {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", "efua.mensah@ridgeway.gh"))
        .unique();
      return user?._id;
    });
    expect(newUserId).toBeDefined();

    const viewer = await asUser(t, newUserId!).query(
      api.profiles.getCurrent,
      {}
    );
    expect(viewer.isStaff).toBe(true);

    const home = await asUser(t, newUserId!).query(api.staff.getHome, {});
    expect(home).toEqual({
      displayName: "Efua Mensah",
      organizationName: "Ridgeway Property Group",
    });
  });

  it("sets a new password on an office person", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const profileId = await asUser(t, staff.userId).action(api.staff.create, {
      displayName: "Efua Mensah",
      email: "efua.mensah@ridgeway.gh",
      password: "RidgewayOffice26",
    });
    const before = await passwordAccountSecret(t, "efua.mensah@ridgeway.gh");

    await asUser(t, staff.userId).action(api.staff.setPassword, {
      profileId,
      password: "RidgewayOffice27",
    });

    const after = await passwordAccountSecret(t, "efua.mensah@ridgeway.gh");
    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect(after).not.toBe(before);
  });

  it("refuses an email that already belongs to staff, field, an owner, or a tenant", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });
    await asUser(t, staff.userId).action(api.owners.grantLogin, {
      displayName: "Kwesi Mensah",
      contactEmail: "kwesi.mensah@ridgeway.gh",
      password: "RidgewayOwnerA26",
    });
    const buildingId = await asUser(t, staff.userId).mutation(
      api.buildings.create,
      {
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
      }
    );
    const unitId = await asUser(t, staff.userId).mutation(api.units.create, {
      buildingId,
      label: "B12",
      kind: "apartment",
    });
    await asUser(t, staff.userId).mutation(api.leases.createWithTenant, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      startedOn: "2024-01-15",
    });

    const taken = [
      "ama.boateng@ridgeway.gh",
      "yaw.darko@ridgeway.gh",
      "kwesi.mensah@ridgeway.gh",
      "akosua.darko@ridgeway.gh",
    ];
    for (const email of taken) {
      try {
        await asUser(t, staff.userId).action(api.staff.create, {
          displayName: "Efua Mensah",
          email,
          password: "RidgewayOffice26",
        });
        throw new Error(`expected create to refuse ${email}`);
      } catch (error) {
        expect(errorCode(error)).toBe("INVALID");
      }
    }
  });

  it("refuses create and the list when the caller is not staff", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });

    try {
      await asUser(t, userId).action(api.staff.create, {
        displayName: "Efua Mensah",
        email: "efua.mensah@ridgeway.gh",
        password: "RidgewayOffice26",
      });
      throw new Error("expected create to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    try {
      await asUser(t, userId).query(api.staff.listForStaff, {});
      throw new Error("expected listForStaff to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });
});
