import { v } from "convex/values";

import { ERROR_CODES, raise } from "./lib/errors";
import { authedQuery, staffMutation, staffQuery } from "./lib/functions";
import { requireBuildingAccess } from "./lib/viewer";

const unitKind = v.union(v.literal("apartment"), v.literal("commercial"));

const unitListItem = v.object({
  _id: v.id("units"),
  label: v.string(),
  kind: unitKind,
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

    return rows.map((row) => ({
      _id: row._id,
      label: row.label,
      kind: row.kind,
    }));
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
  },
  returns: v.id("units"),
  handler: async (ctx, args) => {
    await requireBuildingAccess(ctx, ctx.viewer, args.buildingId);
    const label = requireText(args.label, "Unit label");

    return await ctx.db.insert("units", {
      buildingId: args.buildingId,
      label,
      kind: args.kind,
    });
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
