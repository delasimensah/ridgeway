import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { asUser, errorCode, insertPerson, makeBackend } from "./test.setup";

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
      },
    ]);
    expect(building?.ownerId).toBe(ownerId);
    expect(building?.ownerName).toBe("Kwesi Mensah");
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
});
