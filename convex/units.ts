import { v } from "convex/values";

import { insertLeaseForExistingTenant, insertLeaseWithTenant } from "./leases";
import { ERROR_CODES, raise } from "./lib/errors";
import { authedQuery, staffMutation, staffQuery } from "./lib/functions";
import { isLeaseCurrent, requireBuildingAccess, utcToday } from "./lib/viewer";

const unitKind = v.union(v.literal("apartment"), v.literal("commercial"));

const unitListItem = v.object({
  _id: v.id("units"),
  label: v.string(),
  kind: unitKind,
  tenantName: v.union(v.string(), v.null()),
  leaseId: v.union(v.id("leases"), v.null()),
  leaseEndedOn: v.union(v.string(), v.null()),
});

const unitFormFields = v.object({
  _id: v.id("units"),
  buildingId: v.id("buildings"),
  label: v.string(),
  kind: unitKind,
});

function requireText(value: string, field: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    raise(ERROR_CODES.INVALID, `${field} is required`);
  }
  return trimmed;
}

export const listByBuilding = authedQuery({
  args: {
    buildingId: v.id("buildings"),
  },
  returns: v.array(unitListItem),
  handler: async (ctx, args) => {
    await requireBuildingAccess(ctx, ctx.viewer, args.buildingId);

    const rows = await ctx.db
      .query("units")
      .withIndex("by_buildingId", (q) => q.eq("buildingId", args.buildingId))
      .collect();

    const today = utcToday();

    return await Promise.all(
      rows.map(async (row) => {
        const leases = await ctx.db
          .query("leases")
          .withIndex("by_unitId", (q) => q.eq("unitId", row._id))
          .collect();
        const current =
          leases.find((lease) => isLeaseCurrent(lease, today)) ?? null;
        const tenant =
          current === null ? null : await ctx.db.get(current.tenantProfileId);

        return {
          _id: row._id,
          label: row.label,
          kind: row.kind,
          tenantName: tenant?.displayName ?? null,
          leaseId: current?._id ?? null,
          leaseEndedOn: current?.endedOn ?? null,
        };
      })
    );
  },
});

export const get = staffQuery({
  args: {
    unitId: v.id("units"),
  },
  returns: v.union(unitFormFields, v.null()),
  handler: async (ctx, args) => {
    const unit = await ctx.db.get(args.unitId);
    if (unit === null) {
      return null;
    }

    const building = await ctx.db.get(unit.buildingId);
    if (
      building === null ||
      building.organizationId !== ctx.viewer.organizationId
    ) {
      return null;
    }

    return {
      _id: unit._id,
      buildingId: unit.buildingId,
      label: unit.label,
      kind: unit.kind,
    };
  },
});

export const create = staffMutation({
  args: {
    buildingId: v.id("buildings"),
    label: v.string(),
    kind: unitKind,
    newTenant: v.optional(
      v.object({
        displayName: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        startedOn: v.string(),
        endedOn: v.optional(v.string()),
      })
    ),
    existingTenant: v.optional(
      v.object({
        tenantProfileId: v.id("profiles"),
        startedOn: v.string(),
        endedOn: v.optional(v.string()),
      })
    ),
  },
  returns: v.id("units"),
  handler: async (ctx, args) => {
    await requireBuildingAccess(ctx, ctx.viewer, args.buildingId);
    const label = requireText(args.label, "Unit label");

    if (args.newTenant !== undefined && args.existingTenant !== undefined) {
      raise(ERROR_CODES.INVALID, "Pick a tenant or add a new one, not both");
    }

    const unitId = await ctx.db.insert("units", {
      buildingId: args.buildingId,
      label,
      kind: args.kind,
    });

    if (args.newTenant !== undefined) {
      await insertLeaseWithTenant(ctx, ctx.viewer, unitId, args.newTenant);
    }
    if (args.existingTenant !== undefined) {
      await insertLeaseForExistingTenant(
        ctx,
        ctx.viewer,
        unitId,
        args.existingTenant
      );
    }

    return unitId;
  },
});

export const update = staffMutation({
  args: {
    unitId: v.id("units"),
    label: v.string(),
    kind: unitKind,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const unit = await ctx.db.get(args.unitId);
    if (unit === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    await requireBuildingAccess(ctx, ctx.viewer, unit.buildingId);
    const label = requireText(args.label, "Unit label");

    await ctx.db.patch(args.unitId, {
      label,
      kind: args.kind,
    });
    return null;
  },
});
