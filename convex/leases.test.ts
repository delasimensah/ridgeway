import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import {
  asUser,
  errorCode,
  insertPerson,
  makeBackend,
  passwordAccountSecret,
} from "./test.setup";

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
      hasLogin: false,
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

  it("refuses a second current lease for the same person on another unit", async () => {
    const { t, userId, unitId, otherUnitId } = await staffWithUnit();
    await asUser(t, userId).mutation(api.leases.createWithTenant, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua@example.com",
      startedOn: "2024-01-15",
    });

    try {
      await asUser(t, userId).mutation(api.leases.createWithTenant, {
        unitId: otherUnitId,
        displayName: "Akosua Darko",
        email: "akosua@example.com",
        startedOn: "2024-02-01",
      });
      throw new Error("expected createWithTenant to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
    }
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

  it("lists tenants whose current lease has ended", async () => {
    const { t, userId, unitId, otherUnitId } = await staffWithUnit();
    await asUser(t, userId).mutation(api.leases.createWithTenant, {
      unitId,
      displayName: "Sofia Herrera",
      email: "sofia.herrera@example.com",
      startedOn: "2024-01-15",
      endedOn: "2024-12-31",
    });
    await asUser(t, userId).mutation(api.leases.createWithTenant, {
      unitId: otherUnitId,
      displayName: "Daniel Berg",
      email: "daniel.berg@example.com",
      startedOn: "2024-01-15",
    });

    const available = await asUser(t, userId).query(
      api.leases.listAvailableForStaff,
      {}
    );

    expect(available.map((row) => row.displayName)).toEqual(["Sofia Herrera"]);
  });

  it("grants a login when staff add a tenant with a password", async () => {
    const { t, userId, unitId } = await staffWithUnit();

    const leaseId = await asUser(t, userId).action(api.leases.grantLogin, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      phone: "024 111 2222",
      startedOn: "2024-01-15",
      password: "RidgewayTenant26",
    });

    const loaded = await asUser(t, userId).query(api.leases.get, { leaseId });
    expect(loaded?.hasLogin).toBe(true);

    const tenantUserId = await t.run(async (ctx) => {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", "akosua.darko@ridgeway.gh"))
        .unique();
      return user?._id;
    });
    expect(tenantUserId).toBeDefined();

    const viewer = await asUser(t, tenantUserId!).query(
      api.profiles.getCurrent,
      {}
    );
    expect(viewer.isStaff).toBe(false);
    expect(viewer.ownerId).toBeNull();

    const workOrderId = await asUser(t, tenantUserId!).mutation(
      api.workOrders.createByTenant,
      {
        unitId,
        description: "The kitchen tap drips.",
        category: "plumbing",
        urgency: "normal",
      }
    );
    expect(workOrderId).toBeDefined();
  });

  it("grants a login when staff edit a tenant who has none", async () => {
    const { t, userId, unitId } = await staffWithUnit();
    const leaseId = await asUser(t, userId).mutation(
      api.leases.createWithTenant,
      {
        unitId,
        displayName: "Akosua Darko",
        email: "akosua.darko@ridgeway.gh",
        startedOn: "2024-01-15",
      }
    );

    await asUser(t, userId).action(api.leases.grantLogin, {
      leaseId,
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      startedOn: "2024-01-15",
      password: "RidgewayTenant26",
    });

    const loaded = await asUser(t, userId).query(api.leases.get, { leaseId });
    expect(loaded).toMatchObject({
      email: "akosua.darko@ridgeway.gh",
      hasLogin: true,
    });

    const tenantUserId = await t.run(async (ctx) => {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", "akosua.darko@ridgeway.gh"))
        .unique();
      return user?._id;
    });
    const viewer = await asUser(t, tenantUserId!).query(
      api.profiles.getCurrent,
      {}
    );
    expect(viewer.displayName).toBe("Akosua Darko");
  });

  it("refuses a second login for a tenant who already has one", async () => {
    const { t, userId, unitId } = await staffWithUnit();
    const leaseId = await asUser(t, userId).action(api.leases.grantLogin, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      startedOn: "2024-01-15",
      password: "RidgewayTenant26",
    });

    try {
      await asUser(t, userId).action(api.leases.grantLogin, {
        leaseId,
        displayName: "Akosua Darko",
        email: "akosua.other@ridgeway.gh",
        startedOn: "2024-01-15",
        password: "RidgewayTenant26",
      });
      throw new Error("expected grantLogin to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
    }
  });

  it("refuses an email that already belongs to staff, field, an owner, or a tenant login", async () => {
    const { t, userId, unitId, otherUnitId } = await staffWithUnit();
    await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });
    await asUser(t, userId).action(api.owners.grantLogin, {
      displayName: "Adwoa Owusu",
      contactEmail: "adwoa.owusu@ridgeway.gh",
      password: "RidgewayOwnerB26",
    });
    await asUser(t, userId).action(api.leases.grantLogin, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      startedOn: "2024-01-15",
      password: "RidgewayTenant26",
    });

    const taken = [
      "ama.boateng@ridgeway.gh",
      "yaw.darko@ridgeway.gh",
      "adwoa.owusu@ridgeway.gh",
      "akosua.darko@ridgeway.gh",
    ];
    for (const email of taken) {
      try {
        await asUser(t, userId).action(api.leases.grantLogin, {
          unitId: otherUnitId,
          displayName: "Kofi Owusu",
          email,
          startedOn: "2024-01-15",
          password: "RidgewayTenant26",
        });
        throw new Error(`expected grantLogin to refuse ${email}`);
      } catch (error) {
        expect(errorCode(error)).toBe("INVALID");
      }
    }
  });

  it("refuses grantLogin when the caller is a field worker", async () => {
    const { t, unitId } = await staffWithUnit();
    const { userId } = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });

    try {
      await asUser(t, userId).action(api.leases.grantLogin, {
        unitId,
        displayName: "Akosua Darko",
        email: "akosua.darko@ridgeway.gh",
        startedOn: "2024-01-15",
        password: "RidgewayTenant26",
      });
      throw new Error("expected grantLogin to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("refuses grantLogin when nobody is signed in", async () => {
    const { t, unitId } = await staffWithUnit();

    try {
      await t.action(api.leases.grantLogin, {
        unitId,
        displayName: "Akosua Darko",
        email: "akosua.darko@ridgeway.gh",
        startedOn: "2024-01-15",
        password: "RidgewayTenant26",
      });
      throw new Error("expected grantLogin to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("UNAUTHENTICATED");
    }
  });

  it("sets a new password on a tenant who already has a login", async () => {
    const { t, userId, unitId } = await staffWithUnit();
    const leaseId = await asUser(t, userId).action(api.leases.grantLogin, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      startedOn: "2024-01-15",
      password: "RidgewayTenant26",
    });
    const before = await passwordAccountSecret(t, "akosua.darko@ridgeway.gh");

    await asUser(t, userId).action(api.leases.setPassword, {
      leaseId,
      password: "RidgewayTenant27",
    });

    const after = await passwordAccountSecret(t, "akosua.darko@ridgeway.gh");
    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect(after).not.toBe(before);
  });

  it("lists every tenant, including people with no current lease", async () => {
    const { t, userId, buildingId, unitId, otherUnitId } =
      await staffWithUnit();
    const currentLeaseId = await asUser(t, userId).mutation(
      api.leases.createWithTenant,
      {
        unitId,
        displayName: "Akosua Darko",
        email: "akosua@example.com",
        startedOn: "2024-01-15",
      }
    );
    const endedLeaseId = await asUser(t, userId).mutation(
      api.leases.createWithTenant,
      {
        unitId: otherUnitId,
        displayName: "Sofia Herrera",
        email: "sofia.herrera@example.com",
        startedOn: "2024-01-15",
        endedOn: "2024-12-31",
      }
    );

    const currentStored = await t.run(async (ctx) =>
      ctx.db.get(currentLeaseId)
    );
    const endedStored = await t.run(async (ctx) => ctx.db.get(endedLeaseId));
    const list = await asUser(t, userId).query(api.leases.listForStaff, {});

    expect(list).toEqual([
      {
        _id: currentStored?.tenantProfileId,
        leaseId: currentLeaseId,
        buildingId,
        displayName: "Akosua Darko",
        email: "akosua@example.com",
        hasLogin: false,
        currentBuildingName: "Ridge Court",
        currentUnitLabel: "B12",
      },
      {
        _id: endedStored?.tenantProfileId,
        leaseId: endedLeaseId,
        buildingId,
        displayName: "Sofia Herrera",
        email: "sofia.herrera@example.com",
        hasLogin: false,
        currentBuildingName: null,
        currentUnitLabel: null,
      },
    ]);
  });

  it("refuses the tenant list when the caller is not staff", async () => {
    const { t, userId, unitId } = await staffWithUnit();
    await asUser(t, userId).mutation(api.leases.createWithTenant, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua@example.com",
      startedOn: "2024-01-15",
    });
    const field = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });

    try {
      await asUser(t, field.userId).query(api.leases.listForStaff, {});
      throw new Error("expected listForStaff to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("ends a lease so that tenant loses the unit and keeps their login", async () => {
    const { t, userId, buildingId, unitId } = await staffWithUnit();
    const leaseId = await asUser(t, userId).mutation(
      api.leases.createWithTenant,
      {
        unitId,
        displayName: "Akosua Darko",
        email: "akosua.darko@ridgeway.gh",
        startedOn: "2025-01-01",
      }
    );
    const tenantUserId = await t.run(async (ctx) => {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", "akosua.darko@ridgeway.gh"))
        .unique();
      if (user === null) {
        throw new Error("tenant user missing");
      }
      return user._id;
    });

    const workOrderId = await asUser(t, tenantUserId).mutation(
      api.workOrders.createByTenant,
      {
        unitId,
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      }
    );
    const building = await asUser(t, tenantUserId).query(api.buildings.get, {
      buildingId,
    });
    expect(building?.name).toBe("Ridge Court");

    try {
      await asUser(t, tenantUserId).mutation(api.leases.end, { leaseId });
      throw new Error("expected tenant end to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    await asUser(t, userId).mutation(api.leases.end, { leaseId });

    const viewer = await asUser(t, tenantUserId).query(
      api.profiles.getCurrent,
      {}
    );
    expect(viewer.currentLease).toBeNull();
    expect(viewer.endedLease).toEqual({
      unitLabel: "B12",
      buildingName: "Ridge Court",
    });

    const stillThere = await t.run(async (ctx) => {
      const user = await ctx.db.get(tenantUserId);
      const lease = await ctx.db.get(leaseId);
      return { email: user?.email, endedOn: lease?.endedOn };
    });
    expect(stillThere.email).toBe("akosua.darko@ridgeway.gh");
    expect(stillThere.endedOn).toBeDefined();

    try {
      await asUser(t, tenantUserId).query(api.buildings.get, { buildingId });
      throw new Error("expected building get to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    try {
      await asUser(t, tenantUserId).mutation(api.workOrders.createByTenant, {
        unitId,
        description: "Kitchen tap leak again",
        category: "plumbing",
        urgency: "normal",
      });
      throw new Error("expected createByTenant to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    try {
      await asUser(t, tenantUserId).query(api.workOrders.get, { workOrderId });
      throw new Error("expected work order get to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    const forStaff = await asUser(t, userId).query(api.workOrders.get, {
      workOrderId,
    });
    expect(forStaff?._id).toBe(workOrderId);
    const loaded = await asUser(t, userId).query(api.leases.get, { leaseId });
    expect(loaded?.endedOn).toBe(stillThere.endedOn);
  });
});
