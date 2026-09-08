import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { asUser, errorCode, insertPerson, makeBackend } from "./test.setup";

async function staffWithUnit() {
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
    label: "B12",
    kind: "apartment",
  });
  const otherUnitId = await asUser(t, userId).mutation(api.units.create, {
    buildingId,
    label: "A3",
    kind: "apartment",
  });

  return { t, userId, buildingId, unitId, otherUnitId };
}

describe("leases", () => {
  it("creates a lease that points at the named unit", async () => {
    const { t, userId, buildingId, unitId, otherUnitId } =
      await staffWithUnit();

    const leaseId = await asUser(t, userId).mutation(
      api.leases.createWithTenant,
      {
        unitId,
        displayName: "Akosua Darko",
        email: "akosua@example.com",
        phone: "024 111 2222",
        startedOn: "2024-01-15",
        endedOn: "2027-12-31",
      }
    );

    const stored = await t.run(async (ctx) => ctx.db.get(leaseId));
    const list = await asUser(t, userId).query(api.units.listByBuilding, {
      buildingId,
    });
    const loaded = await asUser(t, userId).query(api.leases.get, { leaseId });

    expect(stored?.unitId).toBe(unitId);
    expect(stored?.unitId).not.toBe(otherUnitId);
    expect(stored?.startedOn).toBe("2024-01-15");
    expect(list.find((row) => row._id === unitId)).toMatchObject({
      tenantName: "Akosua Darko",
      leaseId,
      leaseEndedOn: "2027-12-31",
    });
    expect(list.find((row) => row._id === otherUnitId)?.tenantName).toBeNull();
    expect(loaded).toMatchObject({
      _id: leaseId,
      unitId,
      buildingId,
      displayName: "Akosua Darko",
      email: "akosua@example.com",
      phone: "024 111 2222",
      startedOn: "2024-01-15",
      endedOn: "2027-12-31",
    });
  });

  it("lets signed-in staff correct typed tenant fields", async () => {
    const { t, userId, unitId } = await staffWithUnit();
    const leaseId = await asUser(t, userId).mutation(
      api.leases.createWithTenant,
      {
        unitId,
        displayName: "Akosua Darko",
        email: "akosua@example.com",
        startedOn: "2024-01-15",
      }
    );

    await asUser(t, userId).mutation(api.leases.updateTenant, {
      leaseId,
      displayName: "Akosua A. Darko",
      email: "akosua.darko@example.com",
      phone: "024 333 4444",
      startedOn: "2023-06-01",
      endedOn: "2028-12-31",
    });

    const loaded = await asUser(t, userId).query(api.leases.get, { leaseId });
    expect(loaded).toMatchObject({
      displayName: "Akosua A. Darko",
      email: "akosua.darko@example.com",
      phone: "024 333 4444",
      startedOn: "2023-06-01",
      endedOn: "2028-12-31",
    });
  });

  it("refuses a second current lease on the same unit", async () => {
    const { t, userId, unitId } = await staffWithUnit();
    await asUser(t, userId).mutation(api.leases.createWithTenant, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua@example.com",
      startedOn: "2024-01-15",
    });

    try {
      await asUser(t, userId).mutation(api.leases.createWithTenant, {
        unitId,
        displayName: "Kofi Owusu",
        email: "kofi.owusu@example.com",
        startedOn: "2024-02-01",
      });
      throw new Error("expected createWithTenant to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
    }
  });

  it("refuses a lease start in the future", async () => {
    const { t, userId, unitId } = await staffWithUnit();

    try {
      await asUser(t, userId).mutation(api.leases.createWithTenant, {
        unitId,
        displayName: "Akosua Darko",
        email: "akosua@example.com",
        startedOn: "2099-01-01",
      });
      throw new Error("expected createWithTenant to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
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
    const unitId = await asUser(t, staff.userId).mutation(api.units.create, {
      buildingId,
      label: "B12",
      kind: "apartment",
    });

    try {
      await asUser(t, field.userId).mutation(api.leases.createWithTenant, {
        unitId,
        displayName: "Akosua Darko",
        email: "akosua@example.com",
        startedOn: "2024-01-15",
      });
      throw new Error("expected createWithTenant to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("returns null from get when the lease belongs to another organization", async () => {
    const { t, userId, unitId } = await staffWithUnit();
    const leaseId = await asUser(t, userId).mutation(
      api.leases.createWithTenant,
      {
        unitId,
        displayName: "Akosua Darko",
        email: "akosua@example.com",
        startedOn: "2024-01-15",
      }
    );
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

    const loaded = await asUser(t, other.userId).query(api.leases.get, {
      leaseId,
    });
    expect(loaded).toBeNull();
  });
});
