import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { asUser, errorCode, insertPerson, makeBackend } from "./test.setup";

async function tenantUserIdByEmail(
  t: ReturnType<typeof makeBackend>,
  email: string
) {
  return await t.run(async (ctx) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();
    if (user === null) {
      throw new Error("tenant user missing");
    }
    return user._id;
  });
}

async function seedLeaseWithPeriod(
  t: ReturnType<typeof makeBackend>,
  args: {
    startedOn: string;
    endedOn?: string;
    confirmedStatus?: "unpaid" | "partial" | "paid";
    dueOn?: string;
  }
) {
  const staff = await insertPerson(t, {
    email: "ama.boateng@ridgeway.gh",
    displayName: "Ama Boateng",
    role: "staff",
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
    newTenant: {
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      startedOn: args.startedOn,
      endedOn: args.endedOn,
    },
  });
  const tenantUserId = await tenantUserIdByEmail(t, "akosua.darko@ridgeway.gh");
  const leaseId = await t.run(async (ctx) => {
    const unit = await ctx.db.get(unitId);
    if (unit === null) {
      throw new Error("unit missing");
    }
    const leases = await ctx.db
      .query("leases")
      .withIndex("by_unitId", (q) => q.eq("unitId", unit._id))
      .collect();
    const lease = leases[0];
    if (lease === undefined) {
      throw new Error("lease missing");
    }
    await ctx.db.insert("rentPeriods", {
      leaseId: lease._id,
      periodLabel: "2026-09",
      amount: 450000,
      currency: "GHS",
      dueOn: args.dueOn ?? "2026-09-05",
      confirmedStatus: args.confirmedStatus ?? "unpaid",
    });
    return lease._id;
  });

  return { staff, buildingId, unitId, tenantUserId, leaseId };
}

describe("rent", () => {
  it("lets a current tenant see a period and report payment without setting paid", async () => {
    const t = makeBackend();
    const { staff, buildingId, tenantUserId, leaseId } =
      await seedLeaseWithPeriod(t, {
        startedOn: "2025-01-01",
      });
    await t.run(async (ctx) => {
      await ctx.db.insert("rentPeriods", {
        leaseId,
        periodLabel: "2026-07",
        amount: 450000,
        currency: "GHS",
        dueOn: "2026-07-05",
        confirmedStatus: "paid",
      });
    });

    const listed = await asUser(t, tenantUserId).query(
      api.rent.listForCurrentTenant,
      {}
    );
    expect(listed.periods).toHaveLength(2);
    expect(listed.periods[0]).toMatchObject({
      periodLabel: "2026-09",
      amount: 450000,
      currency: "GHS",
      dueOn: "2026-09-05",
      confirmedStatus: "unpaid",
      tenantReportedAt: null,
      unitLabel: "B12",
      buildingName: "Ridge Court",
    });
    expect(typeof listed.serverNow).toBe("number");

    await asUser(t, tenantUserId).mutation(api.rent.reportPaymentByTenant, {
      rentPeriodId: listed.periods[0]._id,
    });

    const afterReport = await asUser(t, tenantUserId).query(
      api.rent.listForCurrentTenant,
      {}
    );
    expect(afterReport.periods[0].confirmedStatus).toBe("unpaid");
    expect(afterReport.periods[0].tenantReportedAt).not.toBeNull();

    await asUser(t, staff.userId).mutation(api.rent.setConfirmedStatus, {
      rentPeriodId: listed.periods[0]._id,
      confirmedStatus: "paid",
    });

    const afterStaff = await asUser(t, tenantUserId).query(
      api.rent.listForCurrentTenant,
      {}
    );
    expect(afterStaff.periods[0].confirmedStatus).toBe("paid");
    expect(afterStaff.periods[0].tenantReportedAt).not.toBeNull();

    const staffList = await asUser(t, staff.userId).query(
      api.rent.listByBuilding,
      { buildingId, paginationOpts: { numItems: 20, cursor: null } }
    );
    expect(staffList.page).toEqual([
      expect.objectContaining({
        unitLabel: "B12",
        tenantName: "Akosua Darko",
        amount: 450000,
        periodLabel: "2026-09",
        confirmedStatus: "paid",
      }),
    ]);
  });

  it("refuses rent reads and reports after the lease has ended", async () => {
    const t = makeBackend();
    const { tenantUserId, leaseId } = await seedLeaseWithPeriod(t, {
      startedOn: "2024-01-01",
      endedOn: "2025-01-01",
    });

    const periodId = await t.run(async (ctx) => {
      const rows = await ctx.db
        .query("rentPeriods")
        .withIndex("by_leaseId_and_dueOn", (q) => q.eq("leaseId", leaseId))
        .collect();
      return rows[0]._id;
    });

    try {
      await asUser(t, tenantUserId).query(api.rent.listForCurrentTenant, {});
      throw new Error("expected listForCurrentTenant to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    try {
      await asUser(t, tenantUserId).mutation(api.rent.reportPaymentByTenant, {
        rentPeriodId: periodId,
      });
      throw new Error("expected reportPaymentByTenant to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("refuses rent functions for a field worker", async () => {
    const t = makeBackend();
    const { staff, buildingId } = await seedLeaseWithPeriod(t, {
      startedOn: "2025-01-01",
    });
    const field = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
      organizationId: staff.organizationId,
    });

    const periodId = await t.run(async (ctx) => {
      const rows = await ctx.db.query("rentPeriods").collect();
      return rows[0]._id;
    });

    try {
      await asUser(t, field.userId).query(api.rent.listForCurrentTenant, {});
      throw new Error("expected listForCurrentTenant to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    try {
      await asUser(t, field.userId).query(api.rent.listByBuilding, {
        buildingId,
        paginationOpts: { numItems: 20, cursor: null },
      });
      throw new Error("expected listByBuilding to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    try {
      await asUser(t, field.userId).mutation(api.rent.reportPaymentByTenant, {
        rentPeriodId: periodId,
      });
      throw new Error("expected reportPaymentByTenant to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    try {
      await asUser(t, field.userId).mutation(api.rent.setConfirmedStatus, {
        rentPeriodId: periodId,
        confirmedStatus: "paid",
      });
      throw new Error("expected setConfirmedStatus to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("lets staff set partial with a confirmed amount", async () => {
    const t = makeBackend();
    const { staff, tenantUserId } = await seedLeaseWithPeriod(t, {
      startedOn: "2025-01-01",
    });
    const listed = await asUser(t, tenantUserId).query(
      api.rent.listForCurrentTenant,
      {}
    );

    await asUser(t, staff.userId).mutation(api.rent.setConfirmedStatus, {
      rentPeriodId: listed.periods[0]._id,
      confirmedStatus: "partial",
      confirmedAmount: 200000,
    });

    const after = await asUser(t, tenantUserId).query(
      api.rent.listForCurrentTenant,
      {}
    );
    expect(after.periods[0].confirmedStatus).toBe("partial");
    expect(after.periods[0].confirmedAmount).toBe(200000);

    try {
      await asUser(t, staff.userId).mutation(api.rent.setConfirmedStatus, {
        rentPeriodId: listed.periods[0]._id,
        confirmedStatus: "partial",
        confirmedAmount: 450000,
      });
      throw new Error("expected setConfirmedStatus to refuse the full amount");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
    }
  });
});
