import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import {
  asUser,
  errorCode,
  insertPerson,
  makeBackend,
  passwordAccountSecret,
} from "./test.setup";

describe("owners", () => {
  it("lets signed-in staff create an owner and attach them to a building", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const buildingId = await asUser(t, userId).mutation(api.buildings.create, {
      name: "Ridge Court",
      street: "14 Ridge Road",
      area: "Cantonments",
    });

    const ownerId = await asUser(t, userId).mutation(api.owners.create, {
      displayName: "Kwesi Mensah",
      contactEmail: "kwesi@example.com",
      contactPhone: "024 555 0000",
      buildingId,
    });

    const list = await asUser(t, userId).query(api.owners.listForStaff, {});
    const building = await asUser(t, userId).query(api.buildings.get, {
      buildingId,
    });

    expect(list).toEqual([
      {
        _id: ownerId,
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi@example.com",
        contactPhone: "024 555 0000",
        hasLogin: false,
      },
    ]);
    expect(building?.ownerId).toBe(ownerId);
    expect(building?.ownerName).toBe("Kwesi Mensah");

    const buildings = await asUser(t, userId).query(
      api.buildings.listForViewer,
      {}
    );
    expect(buildings).toEqual([
      {
        _id: buildingId,
        name: "Ridge Court",
        address: "14 Ridge Road, Cantonments, Accra",
        ownerName: "Kwesi Mensah",
        unitCount: 0,
        openRepairCount: 0,
      },
    ]);
  });

  it("lets signed-in staff correct typed owner fields", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const ownerId = await asUser(t, userId).mutation(api.owners.create, {
      displayName: "Kwesi Mensah",
      contactEmail: "kwesi@example.com",
    });

    await asUser(t, userId).mutation(api.owners.update, {
      ownerId,
      displayName: "Kwesi A. Mensah",
      contactEmail: "kwesi.mensah@example.com",
      contactPhone: "024 555 1111",
    });

    const loaded = await asUser(t, userId).query(api.owners.get, { ownerId });
    expect(loaded).toEqual({
      _id: ownerId,
      displayName: "Kwesi A. Mensah",
      contactEmail: "kwesi.mensah@example.com",
      contactPhone: "024 555 1111",
      hasLogin: false,
    });
  });

  it("lets staff attach an owner when correcting a building", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const buildingId = await asUser(t, userId).mutation(api.buildings.create, {
      name: "Ridge Court",
      street: "14 Ridge Road",
      area: "Cantonments",
    });
    const ownerId = await asUser(t, userId).mutation(api.owners.create, {
      displayName: "Kwesi Mensah",
    });

    await asUser(t, userId).mutation(api.buildings.update, {
      buildingId,
      name: "Ridge Court",
      street: "14 Ridge Road",
      area: "Cantonments",
      ownerId,
    });

    const building = await asUser(t, userId).query(api.buildings.get, {
      buildingId,
    });
    expect(building?.ownerId).toBe(ownerId);
    expect(building?.ownerName).toBe("Kwesi Mensah");
  });

  it("refuses create when the caller is a field worker", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });

    try {
      await asUser(t, userId).mutation(api.owners.create, {
        displayName: "Kwesi Mensah",
      });
      throw new Error("expected create to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("returns null from get when the owner belongs to another organization", async () => {
    const t = makeBackend();
    const ama = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const otherOrganizationId = await t.run(async (ctx) => {
      return await ctx.db.insert("organizations", {
        name: "Harbour Management",
      });
    });
    const other = await insertPerson(t, {
      email: "kofi.asante@harbour.gh",
      displayName: "Kofi Asante",
      role: "staff",
      organizationId: otherOrganizationId,
    });
    const ownerId = await asUser(t, ama.userId).mutation(api.owners.create, {
      displayName: "Kwesi Mensah",
    });

    const loaded = await asUser(t, other.userId).query(api.owners.get, {
      ownerId,
    });
    expect(loaded).toBeNull();
  });

  it("refuses attaching an owner from another organization", async () => {
    const t = makeBackend();
    const ama = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const otherOrganizationId = await t.run(async (ctx) => {
      return await ctx.db.insert("organizations", {
        name: "Harbour Management",
      });
    });
    const other = await insertPerson(t, {
      email: "kofi.asante@harbour.gh",
      displayName: "Kofi Asante",
      role: "staff",
      organizationId: otherOrganizationId,
    });
    const ownerId = await asUser(t, ama.userId).mutation(api.owners.create, {
      displayName: "Kwesi Mensah",
    });
    const buildingId = await asUser(t, other.userId).mutation(
      api.buildings.create,
      {
        name: "Harbour House",
        street: "1 Independence Avenue",
        area: "Ridge",
      }
    );

    try {
      await asUser(t, other.userId).mutation(api.buildings.update, {
        buildingId,
        name: "Harbour House",
        street: "1 Independence Avenue",
        area: "Ridge",
        ownerId,
      });
      throw new Error("expected update to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("lets staff grant a login the owner role for one owner only", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const owner = await asUser(t, staff.userId).mutation(api.owners.create, {
      displayName: "Kwesi Mensah",
      contactEmail: "kwesi.mensah@ridgeway.gh",
    });
    const otherOwner = await asUser(t, staff.userId).mutation(
      api.owners.create,
      {
        displayName: "Adwoa Owusu",
        contactEmail: "adwoa.owusu@ridgeway.gh",
      }
    );
    const person = await insertPerson(t, {
      email: "kwesi.mensah@ridgeway.gh",
      displayName: "Kwesi Mensah",
      role: null,
    });

    await asUser(t, staff.userId).mutation(api.owners.grantMembership, {
      ownerId: owner,
      profileId: person.profileId,
    });

    const viewer = await asUser(t, person.userId).query(
      api.profiles.getCurrent,
      {}
    );
    expect(viewer.ownerId).toBe(owner);

    try {
      await asUser(t, staff.userId).mutation(api.owners.grantMembership, {
        ownerId: otherOwner,
        profileId: person.profileId,
      });
      throw new Error("expected grant to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
    }
  });

  it("grants a login when staff add an owner with a password", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const otherOwner = await asUser(t, staff.userId).mutation(
      api.owners.create,
      {
        displayName: "Adwoa Owusu",
      }
    );
    await asUser(t, staff.userId).mutation(api.buildings.create, {
      name: "Labone walk-up",
      street: "32 Labone Crescent",
      area: "Labone",
      ownerId: otherOwner,
    });
    const buildingId = await asUser(t, staff.userId).mutation(
      api.buildings.create,
      {
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
      }
    );

    const ownerId = await asUser(t, staff.userId).action(
      api.owners.grantLogin,
      {
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi.mensah@ridgeway.gh",
        contactPhone: "024 555 0000",
        password: "RidgewayOwnerA26",
        buildingId,
      }
    );

    const loaded = await asUser(t, staff.userId).query(api.owners.get, {
      ownerId,
    });
    expect(loaded?.hasLogin).toBe(true);

    const ownerUserId = await t.run(async (ctx) => {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", "kwesi.mensah@ridgeway.gh"))
        .unique();
      return user?._id;
    });
    expect(ownerUserId).toBeDefined();

    const viewer = await asUser(t, ownerUserId!).query(
      api.profiles.getCurrent,
      {}
    );
    expect(viewer.ownerId).toBe(ownerId);

    const buildings = await asUser(t, ownerUserId!).query(
      api.buildings.listForViewer,
      {}
    );
    expect(buildings.map((row) => row.name)).toEqual(["Ridge Court"]);
  });

  it("grants a login when staff edit an owner who has none", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const ownerId = await asUser(t, staff.userId).mutation(api.owners.create, {
      displayName: "Kwesi Mensah",
    });

    await asUser(t, staff.userId).action(api.owners.grantLogin, {
      ownerId,
      displayName: "Kwesi Mensah",
      contactEmail: "kwesi.mensah@ridgeway.gh",
      password: "RidgewayOwnerA26",
    });

    const loaded = await asUser(t, staff.userId).query(api.owners.get, {
      ownerId,
    });
    expect(loaded).toMatchObject({
      contactEmail: "kwesi.mensah@ridgeway.gh",
      hasLogin: true,
    });

    const ownerUserId = await t.run(async (ctx) => {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", "kwesi.mensah@ridgeway.gh"))
        .unique();
      return user?._id;
    });
    const viewer = await asUser(t, ownerUserId!).query(
      api.profiles.getCurrent,
      {}
    );
    expect(viewer.ownerId).toBe(ownerId);
  });

  it("still lets staff grant a login to a second owner", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const firstId = await asUser(t, staff.userId).mutation(api.owners.create, {
      displayName: "Kwesi Mensah",
    });
    const secondId = await asUser(t, staff.userId).mutation(api.owners.create, {
      displayName: "Adwoa Owusu",
    });

    await asUser(t, staff.userId).action(api.owners.grantLogin, {
      ownerId: firstId,
      displayName: "Kwesi Mensah",
      contactEmail: "kwesi.mensah@ridgeway.gh",
      password: "RidgewayOwnerA26",
    });

    const afterFirst = await asUser(t, staff.userId).query(api.owners.get, {
      ownerId: secondId,
    });
    expect(afterFirst?.hasLogin).toBe(false);

    await asUser(t, staff.userId).action(api.owners.grantLogin, {
      ownerId: secondId,
      displayName: "Adwoa Owusu",
      contactEmail: "adwoa.owusu@ridgeway.gh",
      password: "RidgewayOwnerB26",
    });

    const loaded = await asUser(t, staff.userId).query(
      api.owners.listForStaff,
      {}
    );
    expect(loaded.find((row) => row._id === firstId)?.hasLogin).toBe(true);
    expect(loaded.find((row) => row._id === secondId)?.hasLogin).toBe(true);
  });

  it("refuses a second login for an owner who already has one", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const ownerId = await asUser(t, staff.userId).action(
      api.owners.grantLogin,
      {
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi.mensah@ridgeway.gh",
        password: "RidgewayOwnerA26",
      }
    );

    try {
      await asUser(t, staff.userId).action(api.owners.grantLogin, {
        ownerId,
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi.other@ridgeway.gh",
        password: "RidgewayOwnerA26",
      });
      throw new Error("expected grantLogin to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
    }
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
      displayName: "Adwoa Owusu",
      contactEmail: "adwoa.owusu@ridgeway.gh",
      password: "RidgewayOwnerB26",
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
      "adwoa.owusu@ridgeway.gh",
      "akosua.darko@ridgeway.gh",
    ];
    for (const contactEmail of taken) {
      try {
        await asUser(t, staff.userId).action(api.owners.grantLogin, {
          displayName: "Kwesi Mensah",
          contactEmail,
          password: "RidgewayOwnerA26",
        });
        throw new Error(`expected grantLogin to refuse ${contactEmail}`);
      } catch (error) {
        expect(errorCode(error)).toBe("INVALID");
      }
    }
  });

  it("refuses grantLogin when the caller is a field worker", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });

    try {
      await asUser(t, userId).action(api.owners.grantLogin, {
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi.mensah@ridgeway.gh",
        password: "RidgewayOwnerA26",
      });
      throw new Error("expected grantLogin to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("refuses grantLogin when nobody is signed in", async () => {
    const t = makeBackend();

    try {
      await t.action(api.owners.grantLogin, {
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi.mensah@ridgeway.gh",
        password: "RidgewayOwnerA26",
      });
      throw new Error("expected grantLogin to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("UNAUTHENTICATED");
    }
  });

  it("sets a new password on an owner who already has a login", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const ownerId = await asUser(t, staff.userId).action(
      api.owners.grantLogin,
      {
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi.mensah@ridgeway.gh",
        password: "RidgewayOwnerA26",
      }
    );
    const before = await passwordAccountSecret(t, "kwesi.mensah@ridgeway.gh");

    await asUser(t, staff.userId).action(api.owners.setPassword, {
      ownerId,
      password: "RidgewayOwnerA27",
    });

    const after = await passwordAccountSecret(t, "kwesi.mensah@ridgeway.gh");
    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect(after).not.toBe(before);
  });

  it("leaves the owner password alone when the new password is empty", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const ownerId = await asUser(t, staff.userId).action(
      api.owners.grantLogin,
      {
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi.mensah@ridgeway.gh",
        password: "RidgewayOwnerA26",
      }
    );
    const before = await passwordAccountSecret(t, "kwesi.mensah@ridgeway.gh");

    try {
      await asUser(t, staff.userId).action(api.owners.setPassword, {
        ownerId,
        password: "",
      });
      throw new Error("expected setPassword to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
    }

    expect(await passwordAccountSecret(t, "kwesi.mensah@ridgeway.gh")).toBe(
      before
    );
  });

  it("refuses setPassword when the caller is a field worker", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const ownerId = await asUser(t, staff.userId).action(
      api.owners.grantLogin,
      {
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi.mensah@ridgeway.gh",
        password: "RidgewayOwnerA26",
      }
    );
    const { userId } = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });

    try {
      await asUser(t, userId).action(api.owners.setPassword, {
        ownerId,
        password: "RidgewayOwnerA27",
      });
      throw new Error("expected setPassword to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });
});
