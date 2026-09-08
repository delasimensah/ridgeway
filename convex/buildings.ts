import { v } from "convex/values";

import { ERROR_CODES, raise } from "./lib/errors";
import { authedQuery, staffMutation, staffQuery } from "./lib/functions";

const buildingListItem = v.object({
  _id: v.id("buildings"),
  name: v.string(),
  address: v.string(),
  unitCount: v.number(),
});

function requireText(value: string, field: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    raise(ERROR_CODES.INVALID, `${field} is required`);
  }
  return trimmed;
}

const ACCRA_SUFFIX = ", Accra";

export function formatAccraAddress(street: string, area: string): string {
  return `${street}, ${area}${ACCRA_SUFFIX}`;
}

export function parseAccraAddress(address: string): {
  street: string;
  area: string;
} {
  if (!address.endsWith(ACCRA_SUFFIX)) {
    raise(ERROR_CODES.INVALID, "Address must be an Accra address");
  }

  const withoutCity = address.slice(0, -ACCRA_SUFFIX.length);
  const separator = withoutCity.lastIndexOf(", ");
  if (separator <= 0) {
    raise(ERROR_CODES.INVALID, "Address must include street and area");
  }

  const street = withoutCity.slice(0, separator).trim();
  const area = withoutCity.slice(separator + 2).trim();
  if (street.length === 0 || area.length === 0) {
    raise(ERROR_CODES.INVALID, "Address must include street and area");
  }

  return { street, area };
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

    return await Promise.all(
      rows.map(async (row) => {
        const units = await ctx.db
          .query("units")
          .withIndex("by_buildingId", (q) => q.eq("buildingId", row._id))
          .collect();
        return {
          _id: row._id,
          name: row.name,
          address: row.address,
          unitCount: units.length,
        };
      })
    );
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

const buildingFormFields = v.object({
  _id: v.id("buildings"),
  name: v.string(),
  street: v.string(),
  area: v.string(),
  address: v.string(),
});

export const get = staffQuery({
  args: {
    buildingId: v.id("buildings"),
  },
  returns: v.union(buildingFormFields, v.null()),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const building = await ctx.db.get(args.buildingId);
    if (building === null || building.organizationId !== organizationId) {
      return null;
    }

    const { street, area } = parseAccraAddress(building.address);
    return {
      _id: building._id,
      name: building.name,
      street,
      area,
      address: building.address,
    };
  },
});

export const update = staffMutation({
  args: {
    buildingId: v.id("buildings"),
    name: v.string(),
    street: v.string(),
    area: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const building = await ctx.db.get(args.buildingId);
    if (building === null || building.organizationId !== organizationId) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const name = requireText(args.name, "Name");
    const street = requireText(args.street, "Street");
    const area = requireText(args.area, "Area");

    await ctx.db.patch(args.buildingId, {
      name,
      address: formatAccraAddress(street, area),
    });
    return null;
  },
});
