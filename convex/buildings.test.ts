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
        unitCount: 0,
      },
    ]);

    const stored = await t.run(async (ctx) => ctx.db.get(buildingId));
    expect(stored?.organizationId).toBe(organizationId);
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
    });
    expect(list).toEqual([
      {
        _id: buildingId,
        name: "Ridge Court East",
        address: formatAccraAddress("16 Ridge Road", "Labone"),
        unitCount: 0,
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

    const loaded = await asUser(t, other.userId).query(api.buildings.get, {
      buildingId,
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

  it("round-trips street and area through the Accra address format", () => {
    const address = formatAccraAddress("14 Ridge Road", "Cantonments");
    expect(parseAccraAddress(address)).toEqual({
      street: "14 Ridge Road",
      area: "Cantonments",
    });
  });
});
