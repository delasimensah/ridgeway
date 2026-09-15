import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { formatAccraAddress, parseAccraAddress } from "./buildings";
import { asUser, errorCode, insertPerson, makeBackend } from "./test.setup";

describe("buildings", () => {
  it("lets signed-in staff create a building and see it in the list", async () => {
    const t = makeBackend();
    const { userId, organizationId } = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });

    const buildingId = await asUser(t, userId).mutation(api.buildings.create, {
      name: "Ridge Court",
      street: "14 Ridge Road",
      area: "Cantonments",
    });

    const list = await asUser(t, userId).query(api.buildings.listForViewer, {});

    expect(list).toEqual([
      {
        _id: buildingId,
        name: "Ridge Court",
        address: formatAccraAddress("14 Ridge Road", "Cantonments"),
        ownerName: null,
        unitCount: 0,
        emptyUnitCount: 0,
        openRepairCount: 0,
      },
    ]);

    const stored = await t.run(async (ctx) => ctx.db.get(buildingId));
    expect(stored?.organizationId).toBe(organizationId);
  });

  it("lets staff create a building and a new owner in one save", async () => {
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
      newOwner: {
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi@example.com",
      },
    });

    const list = await asUser(t, userId).query(api.buildings.listForViewer, {});
    expect(list).toEqual([
      {
        _id: buildingId,
        name: "Ridge Court",
        address: formatAccraAddress("14 Ridge Road", "Cantonments"),
        ownerName: "Kwesi Mensah",
        unitCount: 0,
        emptyUnitCount: 0,
        openRepairCount: 0,
      },
    ]);
  });

  it("refuses create when an existing owner and a new owner are both sent", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const ownerId = await asUser(t, userId).mutation(api.owners.create, {
      displayName: "Kwesi Mensah",
    });

    try {
      await asUser(t, userId).mutation(api.buildings.create, {
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
        ownerId,
        newOwner: { displayName: "Adwoa Owusu" },
      });
      throw new Error("expected create to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
    }
  });

  it("lets staff assign an existing owner to a building", async () => {
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

    await asUser(t, userId).mutation(api.buildings.assignOwner, {
      buildingId,
      ownerId,
    });

    const building = await asUser(t, userId).query(api.buildings.get, {
      buildingId,
    });
    expect(building?.ownerId).toBe(ownerId);
    expect(building?.ownerName).toBe("Kwesi Mensah");
  });

  it("returns an empty list when the staff organization has no buildings", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });

    const list = await asUser(t, userId).query(api.buildings.listForViewer, {});

    expect(list).toEqual([]);
  });

  it("lists only buildings that belong to the caller's organization", async () => {
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

    await asUser(t, ama.userId).mutation(api.buildings.create, {
      name: "Ridge Court",
      street: "14 Ridge Road",
      area: "Cantonments",
    });
    await asUser(t, other.userId).mutation(api.buildings.create, {
      name: "Harbour House",
      street: "1 Independence Avenue",
      area: "Ridge",
    });

    const amaList = await asUser(t, ama.userId).query(
      api.buildings.listForViewer,
      {}
    );
    const otherList = await asUser(t, other.userId).query(
      api.buildings.listForViewer,
      {}
    );

    expect(amaList.map((row) => row.name)).toEqual(["Ridge Court"]);
    expect(otherList.map((row) => row.name)).toEqual(["Harbour House"]);
  });

  it("refuses create when the caller is a field worker", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });

    try {
      await asUser(t, userId).mutation(api.buildings.create, {
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
      });
      throw new Error("expected create to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("returns an empty list for a field worker", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const field = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });
    await asUser(t, staff.userId).mutation(api.buildings.create, {
      name: "Ridge Court",
      street: "14 Ridge Road",
      area: "Cantonments",
    });

    const list = await asUser(t, field.userId).query(
      api.buildings.listForViewer,
      {}
    );

    expect(list).toEqual([]);
  });

  it("refuses create when the name is only spaces", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });

    try {
      await asUser(t, userId).mutation(api.buildings.create, {
        name: "   ",
        street: "14 Ridge Road",
        area: "Cantonments",
      });
      throw new Error("expected create to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
    }
  });

  it("lets signed-in staff correct a building they already added", async () => {
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

    await asUser(t, userId).mutation(api.buildings.update, {
      buildingId,
      name: "Ridge Court East",
      street: "16 Ridge Road",
      area: "Labone",
    });

    const loaded = await asUser(t, userId).query(api.buildings.get, {
      buildingId,
    });
    const list = await asUser(t, userId).query(api.buildings.listForViewer, {});

    expect(loaded).toEqual({
      _id: buildingId,
      name: "Ridge Court East",
      street: "16 Ridge Road",
      area: "Labone",
      address: formatAccraAddress("16 Ridge Road", "Labone"),
      ownerId: null,
      ownerName: null,
    });
    expect(list).toEqual([
      {
        _id: buildingId,
        name: "Ridge Court East",
        address: formatAccraAddress("16 Ridge Road", "Labone"),
        ownerName: null,
        unitCount: 0,
        emptyUnitCount: 0,
        openRepairCount: 0,
      },
    ]);
  });

  it("refuses update when the building belongs to another organization", async () => {
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

    const buildingId = await asUser(t, ama.userId).mutation(
      api.buildings.create,
      {
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
      }
    );

    try {
      await asUser(t, other.userId).mutation(api.buildings.update, {
        buildingId,
        name: "Harbour House",
        street: "1 Independence Avenue",
        area: "Ridge",
      });
      throw new Error("expected update to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    const loaded = await asUser(t, ama.userId).query(api.buildings.get, {
      buildingId,
    });
    expect(loaded?.name).toBe("Ridge Court");
  });

  it("returns null from get when the building belongs to another organization", async () => {
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

    const buildingId = await asUser(t, ama.userId).mutation(
      api.buildings.create,
      {
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
      }
    );

    try {
      await asUser(t, other.userId).query(api.buildings.get, {
        buildingId,
      });
      throw new Error("expected get to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("refuses update when the caller is a field worker", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const field = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });
    const buildingId = await asUser(t, staff.userId).mutation(
      api.buildings.create,
      {
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
      }
    );

    try {
      await asUser(t, field.userId).mutation(api.buildings.update, {
        buildingId,
        name: "Ridge Court East",
        street: "16 Ridge Road",
        area: "Labone",
      });
      throw new Error("expected update to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("lets owner A see only owner A's buildings and refuses owner B's building by id", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const ownerA = await insertPerson(t, {
      email: "kwesi.mensah@ridgeway.gh",
      displayName: "Kwesi Mensah",
      role: "owner",
    });
    const ownerB = await insertPerson(t, {
      email: "adwoa.owusu@ridgeway.gh",
      displayName: "Adwoa Owusu",
      role: "owner",
    });
    const ownerAId = ownerA.ownerId;
    const ownerBId = ownerB.ownerId;
    if (ownerAId === undefined || ownerBId === undefined) {
      throw new Error("expected owner ids");
    }

    const ownerABuildingId = await asUser(t, staff.userId).mutation(
      api.buildings.create,
      {
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
        ownerId: ownerAId,
      }
    );
    const ownerBBuildingId = await asUser(t, staff.userId).mutation(
      api.buildings.create,
      {
        name: "Labone walk-up",
        street: "32 Labone Crescent",
        area: "Labone",
        ownerId: ownerBId,
      }
    );

    const ownerAList = await asUser(t, ownerA.userId).query(
      api.buildings.listForViewer,
      {}
    );
    const ownerBList = await asUser(t, ownerB.userId).query(
      api.buildings.listForViewer,
      {}
    );

    expect(ownerAList.map((row) => row.name)).toEqual(["Ridge Court"]);
    expect(ownerBList.map((row) => row.name)).toEqual(["Labone walk-up"]);

    const ownBuilding = await asUser(t, ownerA.userId).query(
      api.buildings.get,
      { buildingId: ownerABuildingId }
    );
    expect(ownBuilding._id).toBe(ownerABuildingId);

    try {
      await asUser(t, ownerA.userId).query(api.buildings.get, {
        buildingId: ownerBBuildingId,
      });
      throw new Error("expected get to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    try {
      await asUser(t, ownerA.userId).query(api.units.listByBuilding, {
        buildingId: ownerBBuildingId,
      });
      throw new Error("expected unit list to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("round-trips street and area through the Accra address format", () => {
    const address = formatAccraAddress("14 Ridge Road", "Cantonments");
    expect(parseAccraAddress(address)).toEqual({
      street: "14 Ridge Road",
      area: "Cantonments",
    });
  });
});
