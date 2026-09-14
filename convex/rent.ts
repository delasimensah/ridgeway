import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
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
});

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

function monthLabelFromMillis(serverNow: number): string {
  return new Date(serverNow).toISOString().slice(0, 7);
}

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
  }),
  handler: async (ctx, args) => {
    await requireBuildingAccess(ctx, ctx.viewer, args.buildingId);

    const units = await ctx.db
      .query("units")
      .withIndex("by_buildingId", (q) => q.eq("buildingId", args.buildingId))
      .collect();

    const serverNow = Date.now();
    const periodLabel = monthLabelFromMillis(serverNow);
    const today = utcToday();
    const enriched: {
      period: Doc<"rentPeriods">;
      unitLabel: string;
      tenantName: string;
    }[] = [];

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
        const tenantName = tenant?.displayName ?? "";
        const rows = await periodsForLease(ctx, lease._id);
        for (const period of rows) {
          if (period.periodLabel !== periodLabel) {
            continue;
          }
          enriched.push({ period, unitLabel: unit.label, tenantName });
        }
      }
    }

    enriched.sort((left, right) =>
      left.unitLabel.localeCompare(right.unitLabel)
    );

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
      })),
      isDone: end >= enriched.length,
      continueCursor: String(end),
      serverNow,
      collected: totals.collected,
      outstanding: totals.outstanding,
      currency: totals.currency,
      periodLabel,
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
