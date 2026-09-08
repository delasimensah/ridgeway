import { v } from "convex/values";

import { ERROR_CODES, raise } from "./lib/errors";
import { authedQuery, staffMutation } from "./lib/functions";

const buildingListItem = v.object({
  _id: v.id("buildings"),
  name: v.string(),
  address: v.string(),
});

function requireText(value: string, field: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    raise(ERROR_CODES.INVALID, `${field} is required`);
  }
  return trimmed;
}

export function formatAccraAddress(street: string, area: string): string {
  return `${street}, ${area}, Accra`;
}

export const listForViewer = authedQuery({
  args: {},
  returns: v.array(buildingListItem),
  handler: async (ctx) => {
    if (!ctx.viewer.isStaff) {
      return [];
    }
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const rows = await ctx.db
      .query("buildings")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .collect();

    return rows.map((row) => ({
      _id: row._id,
      name: row.name,
      address: row.address,
    }));
  },
});

export const create = staffMutation({
  args: {
    name: v.string(),
    street: v.string(),
    area: v.string(),
  },
  returns: v.id("buildings"),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const name = requireText(args.name, "Name");
    const street = requireText(args.street, "Street");
    const area = requireText(args.area, "Area");

    return await ctx.db.insert("buildings", {
      organizationId,
      name,
      address: formatAccraAddress(street, area),
    });
  },
});
