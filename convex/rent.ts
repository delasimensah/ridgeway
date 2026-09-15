import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import {
  internalMutation,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { ERROR_CODES, raise } from "./lib/errors";
import {
  authedMutation,
  authedQuery,
  staffMutation,
  staffQuery,
} from "./lib/functions";
import {
  currentLeaseForProfile,
  isLeaseCurrent,
  requireBuildingAccess,
  utcToday,
} from "./lib/viewer";

const confirmedStatus = v.union(
  v.literal("unpaid"),
  v.literal("partial"),
  v.literal("paid")
);

const currency = v.union(v.literal("GHS"), v.literal("USD"));

const tenantPeriod = v.object({
  _id: v.id("rentPeriods"),
  periodLabel: v.string(),
  amount: v.number(),
  currency,
  dueOn: v.string(),
  confirmedStatus,
  confirmedAmount: v.union(v.number(), v.null()),
  tenantReportedAt: v.union(v.number(), v.null()),
  unitLabel: v.string(),
  buildingName: v.string(),
});

const staffPeriod = v.object({
  _id: v.id("rentPeriods"),
  unitLabel: v.string(),
  tenantName: v.string(),
  amount: v.number(),
  currency,
  dueOn: v.string(),
  periodLabel: v.string(),
  confirmedStatus,
  confirmedAmount: v.union(v.number(), v.null()),
  tenantReportedAt: v.union(v.number(), v.null()),
  arrears: v.number(),
});

function outstandingOnPeriod(period: Doc<"rentPeriods">): number {
  if (period.confirmedStatus === "paid") {
    return 0;
  }
  if (period.confirmedStatus === "partial") {
    return Math.max(period.amount - (period.confirmedAmount ?? 0), 0);
  }
  return period.amount;
}

function arrearsBeforeMonth(
  periods: Doc<"rentPeriods">[],
  periodLabel: string
): number {
  let total = 0;
  for (const row of periods) {
    if (row.periodLabel < periodLabel) {
      total += outstandingOnPeriod(row);
    }
  }
  return total;
}

function toTenantPeriod(
  period: Doc<"rentPeriods">,
  unitLabel: string,
  buildingName: string
) {
  return {
    _id: period._id,
    periodLabel: period.periodLabel,
    amount: period.amount,
    currency: period.currency,
    dueOn: period.dueOn,
    confirmedStatus: period.confirmedStatus,
    confirmedAmount: period.confirmedAmount ?? null,
    tenantReportedAt: period.tenantReportedAt ?? null,
    unitLabel,
    buildingName,
  };
}

async function periodsForLease(
  ctx: { db: QueryCtx["db"] },
  leaseId: Id<"leases">
) {
  return await ctx.db
    .query("rentPeriods")
    .withIndex("by_leaseId_and_dueOn", (q) => q.eq("leaseId", leaseId))
    .collect();
}

export async function latestPeriodForLease(
  ctx: { db: QueryCtx["db"] },
  leaseId: Id<"leases">
): Promise<Doc<"rentPeriods"> | null> {
  const rows = await periodsForLease(ctx, leaseId);
  if (rows.length === 0) {
    return null;
  }
  return rows.reduce((latest, row) =>
    row.dueOn > latest.dueOn ? row : latest
  );
}

const PERIOD_LABEL = /^(\d{4})-(\d{2})$/;

export function monthLabelFromMillis(serverNow: number): string {
  return new Date(serverNow).toISOString().slice(0, 7);
}

function requirePeriodLabel(value: string): string {
  const match = PERIOD_LABEL.exec(value);
  if (match === null) {
    raise(ERROR_CODES.INVALID, "Month must be YYYY-MM");
  }
  const month = Number(match[2]);
  if (month < 1 || month > 12) {
    raise(ERROR_CODES.INVALID, "Month must be YYYY-MM");
  }
  return value;
}

export function dueOnForPeriod(
  periodLabel: string,
  rentDueDay: number
): string {
  const year = Number(periodLabel.slice(0, 4));
  const month = Number(periodLabel.slice(5, 7));
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const day = Math.min(rentDueDay, lastDay);
  return `${periodLabel}-${String(day).padStart(2, "0")}`;
}

function leaseCoversPeriod(
  lease: { startedOn: string; endedOn?: string },
  periodLabel: string
): boolean {
  if (lease.startedOn.slice(0, 7) > periodLabel) {
    return false;
  }
  const monthStart = `${periodLabel}-01`;
  return lease.endedOn === undefined || lease.endedOn >= monthStart;
}

function leaseHasRent(lease: Doc<"leases">): lease is Doc<"leases"> & {
  rentAmount: number;
  rentCurrency: "GHS" | "USD";
  rentDueDay: number;
} {
  return (
    lease.rentAmount !== undefined &&
    lease.rentCurrency !== undefined &&
    lease.rentDueDay !== undefined
  );
}

/** Inserts one unpaid row when the lease is chargeable and the month is missing. */
export async function ensureUnpaidPeriodForLease(
  ctx: { db: MutationCtx["db"] },
  lease: Doc<"leases">,
  periodLabel: string
): Promise<boolean> {
  if (!leaseHasRent(lease)) {
    return false;
  }
  if (!leaseCoversPeriod(lease, periodLabel)) {
    return false;
  }

  const existing = await periodsForLease(ctx, lease._id);
  if (existing.some((row) => row.periodLabel === periodLabel)) {
    return false;
  }

  await ctx.db.insert("rentPeriods", {
    leaseId: lease._id,
    periodLabel,
    amount: lease.rentAmount,
    currency: lease.rentCurrency,
    dueOn: dueOnForPeriod(periodLabel, lease.rentDueDay),
    confirmedStatus: "unpaid",
  });
  return true;
}

export async function chargeCurrentMonthForLease(
  ctx: { db: MutationCtx["db"] },
  leaseId: Id<"leases">
): Promise<void> {
  const lease = await ctx.db.get(leaseId);
  if (lease === null) {
    return;
  }
  await ensureUnpaidPeriodForLease(
    ctx,
    lease,
    monthLabelFromMillis(Date.now())
  );
}

export const chargeMonth = internalMutation({
  args: {
    periodLabel: v.optional(v.string()),
  },
  returns: v.object({
    inserted: v.number(),
  }),
  handler: async (ctx, args) => {
    const periodLabel = requirePeriodLabel(
      args.periodLabel ?? monthLabelFromMillis(Date.now())
    );
    const leases = await ctx.db.query("leases").collect();
    let inserted = 0;
    for (const lease of leases) {
      if (await ensureUnpaidPeriodForLease(ctx, lease, periodLabel)) {
        inserted += 1;
      }
    }
    return { inserted };
  },
});

function totalsForMonth(
  periods: Doc<"rentPeriods">[],
  periodLabel: string
): { collected: number; outstanding: number; currency: "GHS" | "USD" } {
  const inMonth = periods.filter((row) => row.periodLabel === periodLabel);
  let collected = 0;
  let outstanding = 0;
  let currency: "GHS" | "USD" = "GHS";
  for (const row of inMonth) {
    currency = row.currency;
    if (row.confirmedStatus === "paid") {
      collected += row.amount;
      continue;
    }
    if (row.confirmedStatus === "partial") {
      const confirmed = row.confirmedAmount ?? 0;
      collected += confirmed;
      outstanding += Math.max(row.amount - confirmed, 0);
      continue;
    }
    outstanding += row.amount;
  }
  return { collected, outstanding, currency };
}

type LeaseRentBundle = {
  buildingId: Id<"buildings">;
  buildingName: string;
  unitLabel: string;
  tenantName: string;
  periods: Doc<"rentPeriods">[];
};

async function currentLeaseRentBundles(
  ctx: { db: QueryCtx["db"] },
  buildings: { _id: Id<"buildings">; name: string }[],
  today: string
): Promise<{
  bundles: LeaseRentBundle[];
  earliestPeriodLabel: string | null;
}> {
  const bundles: LeaseRentBundle[] = [];
  let earliestPeriodLabel: string | null = null;

  for (const building of buildings) {
    const units = await ctx.db
      .query("units")
      .withIndex("by_buildingId", (q) => q.eq("buildingId", building._id))
      .collect();
    for (const unit of units) {
      const leases = await ctx.db
        .query("leases")
        .withIndex("by_unitId", (q) => q.eq("unitId", unit._id))
        .collect();
      for (const lease of leases) {
        if (!isLeaseCurrent(lease, today)) {
          continue;
        }
        const tenant = await ctx.db.get(lease.tenantProfileId);
        const rows = await periodsForLease(ctx, lease._id);
        for (const row of rows) {
          if (
            earliestPeriodLabel === null ||
            row.periodLabel < earliestPeriodLabel
          ) {
            earliestPeriodLabel = row.periodLabel;
          }
        }
        bundles.push({
          buildingId: building._id,
          buildingName: building.name,
          unitLabel: unit.label,
          tenantName: tenant?.displayName ?? "",
          periods: rows,
        });
      }
    }
  }

  return { bundles, earliestPeriodLabel };
}

function clampPeriodLabel(
  requested: string | undefined,
  currentMonth: string,
  earliestPeriodLabel: string | null
): string {
  let periodLabel =
    requested !== undefined ? requirePeriodLabel(requested) : currentMonth;
  if (periodLabel > currentMonth) {
    periodLabel = currentMonth;
  }
  if (earliestPeriodLabel !== null && periodLabel < earliestPeriodLabel) {
    periodLabel = earliestPeriodLabel;
  }
  return periodLabel;
}

function enrichBundlesForMonth(
  bundles: LeaseRentBundle[],
  periodLabel: string
) {
  const enriched: {
    period: Doc<"rentPeriods">;
    buildingId: Id<"buildings">;
    buildingName: string;
    unitLabel: string;
    tenantName: string;
    arrears: number;
  }[] = [];

  for (const lease of bundles) {
    for (const period of lease.periods) {
      if (period.periodLabel !== periodLabel) {
        continue;
      }
      enriched.push({
        period,
        buildingId: lease.buildingId,
        buildingName: lease.buildingName,
        unitLabel: lease.unitLabel,
        tenantName: lease.tenantName,
        arrears: arrearsBeforeMonth(lease.periods, periodLabel),
      });
    }
  }

  enriched.sort((left, right) => left.unitLabel.localeCompare(right.unitLabel));
  return enriched;
}

export const listForCurrentTenant = authedQuery({
  args: {},
  returns: v.object({
    serverNow: v.number(),
    periods: v.array(tenantPeriod),
  }),
  handler: async (ctx) => {
    if (ctx.viewer.isField) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const lease = await currentLeaseForProfile(
      ctx,
      ctx.viewer.profile._id,
      utcToday()
    );
    if (lease === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const unit = await ctx.db.get(lease.unitId);
    const building = unit === null ? null : await ctx.db.get(unit.buildingId);
    if (unit === null || building === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const rows = await periodsForLease(ctx, lease._id);
    rows.sort((left, right) => right.dueOn.localeCompare(left.dueOn));

    return {
      serverNow: Date.now(),
      periods: rows.map((row) =>
        toTenantPeriod(row, unit.label, building.name)
      ),
    };
  },
});

export const listByBuilding = staffQuery({
  args: {
    buildingId: v.id("buildings"),
    paginationOpts: paginationOptsValidator,
    periodLabel: v.optional(v.string()),
  },
  returns: v.object({
    page: v.array(staffPeriod),
    isDone: v.boolean(),
    continueCursor: v.string(),
    serverNow: v.number(),
    collected: v.number(),
    outstanding: v.number(),
    currency,
    periodLabel: v.string(),
    earliestPeriodLabel: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const building = await requireBuildingAccess(
      ctx,
      ctx.viewer,
      args.buildingId
    );

    const serverNow = Date.now();
    const currentMonth = monthLabelFromMillis(serverNow);
    const { bundles, earliestPeriodLabel } = await currentLeaseRentBundles(
      ctx,
      [{ _id: building._id, name: building.name }],
      utcToday()
    );
    const periodLabel = clampPeriodLabel(
      args.periodLabel,
      currentMonth,
      earliestPeriodLabel
    );
    const enriched = enrichBundlesForMonth(bundles, periodLabel);
    const totals = totalsForMonth(
      enriched.map((row) => row.period),
      periodLabel
    );

    const start =
      args.paginationOpts.cursor === null
        ? 0
        : Number(args.paginationOpts.cursor);
    const end = start + args.paginationOpts.numItems;
    const slice = enriched.slice(start, end);

    return {
      page: slice.map((row) => ({
        _id: row.period._id,
        unitLabel: row.unitLabel,
        tenantName: row.tenantName,
        amount: row.period.amount,
        currency: row.period.currency,
        dueOn: row.period.dueOn,
        periodLabel: row.period.periodLabel,
        confirmedStatus: row.period.confirmedStatus,
        confirmedAmount: row.period.confirmedAmount ?? null,
        tenantReportedAt: row.period.tenantReportedAt ?? null,
        arrears: row.arrears,
      })),
      isDone: end >= enriched.length,
      continueCursor: String(end),
      serverNow,
      collected: totals.collected,
      outstanding: totals.outstanding,
      currency: totals.currency,
      periodLabel,
      earliestPeriodLabel,
    };
  },
});

export const listForStaff = staffQuery({
  args: {},
  returns: v.object({
    serverNow: v.number(),
    periodLabel: v.string(),
    collected: v.number(),
    outstanding: v.number(),
    currency,
    periods: v.array(
      v.object({
        _id: v.id("rentPeriods"),
        confirmedStatus,
        dueOn: v.string(),
      })
    ),
  }),
  handler: async (ctx) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const buildings = await ctx.db
      .query("buildings")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .collect();

    const serverNow = Date.now();
    const currentMonth = monthLabelFromMillis(serverNow);
    const { bundles, earliestPeriodLabel } = await currentLeaseRentBundles(
      ctx,
      buildings,
      utcToday()
    );
    const periodLabel = clampPeriodLabel(
      undefined,
      currentMonth,
      earliestPeriodLabel
    );
    const enriched = enrichBundlesForMonth(bundles, periodLabel);
    const totals = totalsForMonth(
      enriched.map((row) => row.period),
      periodLabel
    );

    return {
      serverNow,
      periodLabel,
      collected: totals.collected,
      outstanding: totals.outstanding,
      currency: totals.currency,
      periods: enriched.map((row) => ({
        _id: row.period._id,
        confirmedStatus: row.period.confirmedStatus,
        dueOn: row.period.dueOn,
      })),
    };
  },
});

export const setConfirmedStatus = staffMutation({
  args: {
    rentPeriodId: v.id("rentPeriods"),
    confirmedStatus,
    confirmedAmount: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const period = await ctx.db.get(args.rentPeriodId);
    if (period === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const lease = await ctx.db.get(period.leaseId);
    if (lease === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const unit = await ctx.db.get(lease.unitId);
    if (unit === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    await requireBuildingAccess(ctx, ctx.viewer, unit.buildingId);

    if (args.confirmedStatus === "partial") {
      const confirmedAmount = args.confirmedAmount;
      if (confirmedAmount === undefined || confirmedAmount <= 0) {
        raise(ERROR_CODES.INVALID, "Partial rent needs a confirmed amount");
      }
      if (confirmedAmount >= period.amount) {
        raise(
          ERROR_CODES.INVALID,
          "A partial payment must be less than the full rent"
        );
      }
      await ctx.db.patch(period._id, {
        confirmedStatus: "partial",
        confirmedAmount,
      });
      return null;
    }

    await ctx.db.patch(period._id, {
      confirmedStatus: args.confirmedStatus,
      confirmedAmount: undefined,
    });
    return null;
  },
});

export const reportPaymentByTenant = authedMutation({
  args: {
    rentPeriodId: v.id("rentPeriods"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (ctx.viewer.isField || ctx.viewer.isStaff) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const period = await ctx.db.get(args.rentPeriodId);
    if (period === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const lease = await ctx.db.get(period.leaseId);
    if (lease === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    if (lease.tenantProfileId !== ctx.viewer.profile._id) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    if (!isLeaseCurrent(lease, utcToday())) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    await ctx.db.patch(period._id, {
      tenantReportedAt: Date.now(),
    });
    return null;
  },
});
