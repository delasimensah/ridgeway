import { describe, expect, it } from "vitest";

import { api, internal } from "./_generated/api";
import { asUser, errorCode, insertPerson, makeBackend } from "./test.setup";
import { dueOnForPeriod, monthLabelFromMillis } from "./rent";
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

  it("charges each current lease once for a month and skips repeats", async () => {
    const t = makeBackend();
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
    });
    await asUser(t, staff.userId).mutation(api.leases.createWithTenant, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      startedOn: "2025-01-01",
      rentAmount: 450000,
      rentCurrency: "GHS",
      rentDueDay: 5,
    });

    const first = await t.mutation(internal.rent.chargeMonth, {
      periodLabel: "2026-10",
    });
    expect(first.inserted).toBe(1);

    const rows = await t.run(async (ctx) => {
      return await ctx.db.query("rentPeriods").collect();
    });
    const october = rows.filter((row) => row.periodLabel === "2026-10");
    expect(october).toHaveLength(1);
    expect(october[0]).toMatchObject({
      amount: 450000,
      currency: "GHS",
      dueOn: "2026-10-05",
      confirmedStatus: "unpaid",
    });

    const second = await t.mutation(internal.rent.chargeMonth, {
      periodLabel: "2026-10",
    });
    expect(second.inserted).toBe(0);
    const afterRepeat = await t.run(async (ctx) => {
      return await ctx.db.query("rentPeriods").collect();
    });
    expect(
      afterRepeat.filter((row) => row.periodLabel === "2026-10")
    ).toHaveLength(1);
  });

  it("does not charge an ended lease for a later month", async () => {
    const t = makeBackend();
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
    });
    await asUser(t, staff.userId).mutation(api.leases.createWithTenant, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      startedOn: "2025-01-01",
      endedOn: "2026-08-31",
      rentAmount: 450000,
      rentCurrency: "GHS",
      rentDueDay: 5,
    });

    const result = await t.mutation(internal.rent.chargeMonth, {
      periodLabel: "2026-09",
    });
    expect(result.inserted).toBe(0);
    const rows = await t.run(async (ctx) => {
      return await ctx.db.query("rentPeriods").collect();
    });
    expect(rows.filter((row) => row.periodLabel === "2026-09")).toHaveLength(0);
  });

  it("skips a lease with no rent set", async () => {
    const t = makeBackend();
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
    });
    await asUser(t, staff.userId).mutation(api.leases.createWithTenant, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      startedOn: "2025-01-01",
    });

    const result = await t.mutation(internal.rent.chargeMonth, {
      periodLabel: "2026-09",
    });
    expect(result.inserted).toBe(0);
    const rows = await t.run(async (ctx) => {
      return await ctx.db.query("rentPeriods").collect();
    });
    expect(rows).toHaveLength(0);
  });

  it("charges the current month when staff create a lease with rent", async () => {
    const t = makeBackend();
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
    });
    await asUser(t, staff.userId).mutation(api.leases.createWithTenant, {
      unitId,
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      startedOn: "2025-01-01",
      rentAmount: 450000,
      rentCurrency: "GHS",
      rentDueDay: 5,
    });

    const periodLabel = monthLabelFromMillis(Date.now());
    const rows = await t.run(async (ctx) => {
      return await ctx.db.query("rentPeriods").collect();
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      periodLabel,
      amount: 450000,
      currency: "GHS",
      dueOn: dueOnForPeriod(periodLabel, 5),
      confirmedStatus: "unpaid",
    });
  });

  it("lists a past month with that month's totals and carries arrears forward", async () => {
    const t = makeBackend();
    const { staff, buildingId, leaseId } = await seedLeaseWithPeriod(t, {
      startedOn: "2025-01-01",
      confirmedStatus: "paid",
    });
    await t.run(async (ctx) => {
      await ctx.db.insert("rentPeriods", {
        leaseId,
        periodLabel: "2026-08",
        amount: 450000,
        currency: "GHS",
        dueOn: "2026-08-05",
        confirmedStatus: "unpaid",
      });
      await ctx.db.insert("rentPeriods", {
        leaseId,
        periodLabel: "2026-07",
        amount: 450000,
        currency: "GHS",
        dueOn: "2026-07-05",
        confirmedStatus: "partial",
        confirmedAmount: 150000,
      });
    });

    const august = await asUser(t, staff.userId).query(
      api.rent.listByBuilding,
      {
        buildingId,
        periodLabel: "2026-08",
        paginationOpts: { numItems: 20, cursor: null },
      }
    );
    expect(august.periodLabel).toBe("2026-08");
    expect(august.earliestPeriodLabel).toBe("2026-07");
    expect(august.collected).toBe(0);
    expect(august.outstanding).toBe(450000);
    expect(august.page).toEqual([
      expect.objectContaining({
        unitLabel: "B12",
        periodLabel: "2026-08",
        confirmedStatus: "unpaid",
        amount: 450000,
        arrears: 300000,
      }),
    ]);

    const september = await asUser(t, staff.userId).query(
      api.rent.listByBuilding,
      {
        buildingId,
        periodLabel: "2026-09",
        paginationOpts: { numItems: 20, cursor: null },
      }
    );
    expect(september.periodLabel).toBe("2026-09");
    expect(september.collected).toBe(450000);
    expect(september.outstanding).toBe(0);
    expect(september.page[0]).toMatchObject({
      periodLabel: "2026-09",
      confirmedStatus: "paid",
      arrears: 750000,
    });

    await asUser(t, staff.userId).mutation(api.rent.setConfirmedStatus, {
      rentPeriodId: august.page[0]._id,
      confirmedStatus: "paid",
    });
    const augustAfter = await asUser(t, staff.userId).query(
      api.rent.listByBuilding,
      {
        buildingId,
        periodLabel: "2026-08",
        paginationOpts: { numItems: 20, cursor: null },
      }
    );
    expect(augustAfter.collected).toBe(450000);
    expect(augustAfter.outstanding).toBe(0);
    expect(augustAfter.page[0].confirmedStatus).toBe("paid");
  });

  it("does not open a month before the earliest charge or after the current month", async () => {
    const t = makeBackend();
    const { staff, buildingId } = await seedLeaseWithPeriod(t, {
      startedOn: "2025-01-01",
    });
    const currentMonth = monthLabelFromMillis(Date.now());

    const tooEarly = await asUser(t, staff.userId).query(
      api.rent.listByBuilding,
      {
        buildingId,
        periodLabel: "2020-01",
        paginationOpts: { numItems: 20, cursor: null },
      }
    );
    expect(tooEarly.periodLabel).toBe("2026-09");
    expect(tooEarly.earliestPeriodLabel).toBe("2026-09");

    const [year, month] = currentMonth.split("-").map(Number);
    const futureMonth =
      month === 12
        ? `${year + 1}-01`
        : `${year}-${String(month + 1).padStart(2, "0")}`;
    const tooLate = await asUser(t, staff.userId).query(
      api.rent.listByBuilding,
      {
        buildingId,
        periodLabel: futureMonth,
        paginationOpts: { numItems: 20, cursor: null },
      }
    );
    expect(tooLate.periodLabel).toBe(currentMonth);
  });

  it("lets staff see this month's rent across buildings", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const ridgeCourtId = await asUser(t, staff.userId).mutation(
      api.buildings.create,
      {
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
      }
    );
    const laboneId = await asUser(t, staff.userId).mutation(
      api.buildings.create,
      {
        name: "Labone walk-up",
        street: "32 Labone Crescent",
        area: "Labone",
      }
    );
    await asUser(t, staff.userId).mutation(api.units.create, {
      buildingId: ridgeCourtId,
      label: "B12",
      kind: "apartment",
      newTenant: {
        displayName: "Akosua Darko",
        email: "akosua.darko@ridgeway.gh",
        startedOn: "2025-01-01",
      },
    });
    await asUser(t, staff.userId).mutation(api.units.create, {
      buildingId: laboneId,
      label: "A1",
      kind: "apartment",
      newTenant: {
        displayName: "Kojo Owusu",
        email: "kojo.owusu@ridgeway.gh",
        startedOn: "2025-01-01",
      },
    });
    const currentMonth = monthLabelFromMillis(Date.now());
    await t.run(async (ctx) => {
      const leases = await ctx.db.query("leases").collect();
      const first = leases[0];
      const second = leases[1];
      if (first === undefined || second === undefined) {
        throw new Error("leases missing");
      }
      await ctx.db.insert("rentPeriods", {
        leaseId: first._id,
        periodLabel: currentMonth,
        amount: 450000,
        currency: "GHS",
        dueOn: dueOnForPeriod(currentMonth, 5),
        confirmedStatus: "paid",
      });
      await ctx.db.insert("rentPeriods", {
        leaseId: second._id,
        periodLabel: currentMonth,
        amount: 300000,
        currency: "GHS",
        dueOn: dueOnForPeriod(currentMonth, 5),
        confirmedStatus: "unpaid",
      });
    });

    const listed = await asUser(t, staff.userId).query(
      api.rent.listForStaff,
      {}
    );
    expect(listed.periodLabel).toBe(currentMonth);
    expect(listed.collected).toBe(450000);
    expect(listed.outstanding).toBe(300000);
    expect(listed.periods).toHaveLength(2);
    expect(listed.periods.map((row) => row.confirmedStatus).sort()).toEqual([
      "paid",
      "unpaid",
    ]);
  });

  it("refuses listForStaff when the caller is not staff", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });

    try {
      await asUser(t, userId).query(api.rent.listForStaff, {});
      throw new Error("expected listForStaff to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });
});
