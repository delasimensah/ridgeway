import { v } from "convex/values";

import { ERROR_CODES, raise } from "./lib/errors";
import { staffMutation, staffQuery } from "./lib/functions";
import { requireBuildingAccess } from "./lib/viewer";

function requireText(value: string, field: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    raise(ERROR_CODES.INVALID, `${field} is required`);
  }
  return trimmed;
}

function optionalText(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function optionalEmail(value: string | undefined): string | undefined {
  const trimmed = optionalText(value);
  if (trimmed === undefined) {
    return undefined;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    raise(ERROR_CODES.INVALID, "Enter a valid email");
  }
  return trimmed.toLowerCase();
}

const ownerListItem = v.object({
  _id: v.id("owners"),
  displayName: v.string(),
  contactEmail: v.union(v.string(), v.null()),
  contactPhone: v.union(v.string(), v.null()),
});

const ownerFormFields = v.object({
  _id: v.id("owners"),
  displayName: v.string(),
  contactEmail: v.union(v.string(), v.null()),
  contactPhone: v.union(v.string(), v.null()),
});

export const listForStaff = staffQuery({
  args: {},
  returns: v.array(ownerListItem),
  handler: async (ctx) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const rows = await ctx.db
      .query("owners")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .collect();

    return rows.map((row) => ({
      _id: row._id,
      displayName: row.displayName,
      contactEmail: row.contactEmail ?? null,
      contactPhone: row.contactPhone ?? null,
    }));
  },
});

export const get = staffQuery({
  args: {
    ownerId: v.id("owners"),
  },
  returns: v.union(ownerFormFields, v.null()),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const owner = await ctx.db.get(args.ownerId);
    if (owner === null || owner.organizationId !== organizationId) {
      return null;
    }

    return {
      _id: owner._id,
      displayName: owner.displayName,
      contactEmail: owner.contactEmail ?? null,
      contactPhone: owner.contactPhone ?? null,
    };
  },
});

export const create = staffMutation({
  args: {
    displayName: v.string(),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    buildingId: v.optional(v.id("buildings")),
  },
  returns: v.id("owners"),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const displayName = requireText(args.displayName, "Full name");
    const contactEmail = optionalEmail(args.contactEmail);
    const contactPhone = optionalText(args.contactPhone);

    if (args.buildingId !== undefined) {
      const building = await requireBuildingAccess(
        ctx,
        ctx.viewer,
        args.buildingId
      );
      if (building.organizationId !== organizationId) {
        raise(ERROR_CODES.NOT_PERMITTED);
      }
    }

    const ownerId = await ctx.db.insert("owners", {
      organizationId,
      displayName,
      ...(contactEmail !== undefined ? { contactEmail } : {}),
      ...(contactPhone !== undefined ? { contactPhone } : {}),
    });

    if (args.buildingId !== undefined) {
      await ctx.db.patch(args.buildingId, { ownerId });
    }

    return ownerId;
  },
});

export const update = staffMutation({
  args: {
    ownerId: v.id("owners"),
    displayName: v.string(),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const owner = await ctx.db.get(args.ownerId);
    if (owner === null || owner.organizationId !== organizationId) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const displayName = requireText(args.displayName, "Full name");
    const contactEmail = optionalEmail(args.contactEmail);
    const contactPhone = optionalText(args.contactPhone);

    await ctx.db.patch(args.ownerId, {
      displayName,
      ...(contactEmail !== undefined ? { contactEmail } : {}),
      ...(contactPhone !== undefined ? { contactPhone } : {}),
    });
    return null;
  },
});
