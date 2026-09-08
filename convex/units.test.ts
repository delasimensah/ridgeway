import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { asUser, errorCode, insertPerson, makeBackend } from "./test.setup";

describe("units", () => {
  it("lets signed-in staff create a unit under a building and see it there", async () => {
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
    const otherBuildingId = await asUser(t, userId).mutation(
      api.buildings.create,
      {
        name: "Labone walk-up",
        street: "32 Labone Crescent",
        area: "Labone",
      }
    );

    const unitId = await asUser(t, userId).mutation(api.units.create, {
      buildingId,
      label: "A3",
      kind: "apartment",
    });

    const list = await asUser(t, userId).query(api.units.listByBuilding, {
      buildingId,
    });
    const otherList = await asUser(t, userId).query(api.units.listByBuilding, {
      buildingId: otherBuildingId,
    });
    const buildings = await asUser(t, userId).query(
      api.buildings.listForViewer,
      {}
    );

    expect(list).toEqual([
      {
        _id: unitId,
        label: "A3",
        kind: "apartment",
        tenantName: null,
        leaseId: null,
        leaseEndedOn: null,
      },
    ]);
    expect(otherList).toEqual([]);
    expect(buildings.find((row) => row._id === buildingId)?.unitCount).toBe(1);
    expect(
      buildings.find((row) => row._id === otherBuildingId)?.unitCount
    ).toBe(0);
  });

  it("returns an empty list when the building has no units", async () => {
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

    const list = await asUser(t, userId).query(api.units.listByBuilding, {
      buildingId,
    });

    expect(list).toEqual([]);
  });

  it("refuses create when the building belongs to another organization", async () => {
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
      await asUser(t, other.userId).mutation(api.units.create, {
        buildingId,
        label: "A3",
        kind: "apartment",
      });
      throw new Error("expected create to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("refuses listByBuilding when the building belongs to another organization", async () => {
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
    await asUser(t, ama.userId).mutation(api.units.create, {
      buildingId,
      label: "A3",
      kind: "apartment",
    });

    try {
      await asUser(t, other.userId).query(api.units.listByBuilding, {
        buildingId,
      });
      throw new Error("expected listByBuilding to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("refuses create when the caller is a field worker", async () => {
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
      await asUser(t, field.userId).mutation(api.units.create, {
        buildingId,
        label: "A3",
        kind: "apartment",
      });
      throw new Error("expected create to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("refuses create when the label is only spaces", async () => {
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

    try {
      await asUser(t, userId).mutation(api.units.create, {
        buildingId,
        label: "   ",
        kind: "apartment",
      });
      throw new Error("expected create to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
    }
  });

  it("lets signed-in staff correct a unit label they already added", async () => {
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
    const unitId = await asUser(t, userId).mutation(api.units.create, {
      buildingId,
      label: "A3",
      kind: "apartment",
    });

    await asUser(t, userId).mutation(api.units.update, {
      unitId,
      label: "B12",
      kind: "commercial",
    });

    const loaded = await asUser(t, userId).query(api.units.get, { unitId });
    const list = await asUser(t, userId).query(api.units.listByBuilding, {
      buildingId,
    });

    expect(loaded).toEqual({
      _id: unitId,
      buildingId,
      label: "B12",
      kind: "commercial",
    });
    expect(list).toEqual([
      {
        _id: unitId,
        label: "B12",
        kind: "commercial",
        tenantName: null,
        leaseId: null,
        leaseEndedOn: null,
      },
    ]);
  });

  it("does not move a unit to another building on update", async () => {
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
    const otherBuildingId = await asUser(t, userId).mutation(
      api.buildings.create,
      {
        name: "Labone walk-up",
        street: "32 Labone Crescent",
        area: "Labone",
      }
    );
    const unitId = await asUser(t, userId).mutation(api.units.create, {
      buildingId,
      label: "A3",
      kind: "apartment",
    });

    await asUser(t, userId).mutation(api.units.update, {
      unitId,
      label: "B12",
      kind: "apartment",
    });

    const loaded = await asUser(t, userId).query(api.units.get, { unitId });
    expect(loaded?.buildingId).toBe(buildingId);
    expect(loaded?.buildingId).not.toBe(otherBuildingId);
  });

  it("refuses update when the unit belongs to another organization", async () => {
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
    const unitId = await asUser(t, ama.userId).mutation(api.units.create, {
      buildingId,
      label: "A3",
      kind: "apartment",
    });

    try {
      await asUser(t, other.userId).mutation(api.units.update, {
        unitId,
        label: "Harbour 1",
        kind: "commercial",
      });
      throw new Error("expected update to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    const loaded = await asUser(t, ama.userId).query(api.units.get, { unitId });
    expect(loaded?.label).toBe("A3");
  });

  it("returns null from get when the unit belongs to another organization", async () => {
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
    const unitId = await asUser(t, ama.userId).mutation(api.units.create, {
      buildingId,
      label: "A3",
      kind: "apartment",
    });

    const loaded = await asUser(t, other.userId).query(api.units.get, {
      unitId,
    });
    expect(loaded).toBeNull();
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
    const unitId = await asUser(t, staff.userId).mutation(api.units.create, {
      buildingId,
      label: "A3",
      kind: "apartment",
    });

    try {
      await asUser(t, field.userId).mutation(api.units.update, {
        unitId,
        label: "B12",
        kind: "apartment",
      });
      throw new Error("expected update to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });
});
