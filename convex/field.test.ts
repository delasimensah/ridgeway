import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { asUser, errorCode, insertPerson, makeBackend } from "./test.setup";

describe("field workers", () => {
  it("lets signed-in staff add a field worker who is field, not staff", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const yaw = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });

    const profileId = await asUser(t, staff.userId).action(api.field.create, {
      displayName: "Kofi Asante",
      email: "kofi.asante@ridgeway.gh",
      password: "RidgewayField26",
    });

    const loaded = await asUser(t, staff.userId).query(api.field.get, {
      profileId,
    });
    expect(loaded).toMatchObject({
      _id: profileId,
      displayName: "Kofi Asante",
      email: "kofi.asante@ridgeway.gh",
      hasLogin: true,
    });

    const list = await asUser(t, staff.userId).query(
      api.field.listForStaff,
      {}
    );
    expect(list).toEqual(
      expect.arrayContaining([
        {
          _id: yaw.profileId,
          displayName: "Yaw Darko",
          email: "yaw.darko@ridgeway.gh",
          hasLogin: true,
        },
        {
          _id: profileId,
          displayName: "Kofi Asante",
          email: "kofi.asante@ridgeway.gh",
          hasLogin: true,
        },
      ])
    );

    const newUserId = await t.run(async (ctx) => {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", "kofi.asante@ridgeway.gh"))
        .unique();
      return user?._id;
    });
    expect(newUserId).toBeDefined();

    const viewer = await asUser(t, newUserId!).query(
      api.profiles.getCurrent,
      {}
    );
    expect(viewer.isField).toBe(true);
    expect(viewer.isStaff).toBe(false);
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
        await asUser(t, staff.userId).action(api.field.create, {
          displayName: "Kofi Asante",
          email,
          password: "RidgewayField26",
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
      await asUser(t, userId).action(api.field.create, {
        displayName: "Kofi Asante",
        email: "kofi.asante@ridgeway.gh",
        password: "RidgewayField26",
      });
      throw new Error("expected create to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    try {
      await asUser(t, userId).query(api.field.listForStaff, {});
      throw new Error("expected listForStaff to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });
});
