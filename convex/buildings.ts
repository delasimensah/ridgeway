import { v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { ERROR_CODES, raise } from "./lib/errors";
import { authedQuery, staffMutation } from "./lib/functions";
import {
  isLeaseCurrent,
  requireBuildingAccess,
  utcToday,
  type Viewer,
} from "./lib/viewer";
import { insertOwnerForOrg } from "./owners";

const buildingListItem = v.object({
  _id: v.id("buildings"),
  name: v.string(),
  address: v.string(),
  ownerName: v.union(v.string(), v.null()),
  unitCount: v.number(),
  emptyUnitCount: v.number(),
  openRepairCount: v.number(),
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
    const rows = await buildingsVisibleToViewer(ctx);
    const today = utcToday();

    return await Promise.all(
      rows.map(async (row) => {
        const units = await ctx.db
          .query("units")
          .withIndex("by_buildingId", (q) => q.eq("buildingId", row._id))
          .collect();
        const owner =
          row.ownerId === undefined ? null : await ctx.db.get(row.ownerId);
        const tickets = await ctx.db
          .query("workOrders")
          .withIndex("by_buildingId_and_status", (q) =>
            q.eq("buildingId", row._id)
          )
          .collect();
        let emptyUnitCount = 0;
        for (const unit of units) {
          const leases = await ctx.db
            .query("leases")
            .withIndex("by_unitId", (q) => q.eq("unitId", unit._id))
            .collect();
          const occupied = leases.some((lease) => isLeaseCurrent(lease, today));
          if (!occupied) {
            emptyUnitCount += 1;
          }
        }
        return {
          _id: row._id,
          name: row.name,
          address: row.address,
          ownerName: owner?.displayName ?? null,
          unitCount: units.length,
          emptyUnitCount,
          openRepairCount: tickets.filter((ticket) => ticket.status !== "done")
            .length,
        };
      })
    );
  },
});

async function buildingsVisibleToViewer(
  ctx: QueryCtx & { viewer: Viewer }
): Promise<Doc<"buildings">[]> {
  if (ctx.viewer.isStaff) {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }
    return await ctx.db
      .query("buildings")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .collect();
  }

  if (ctx.viewer.ownerId !== null) {
    const ownerId = ctx.viewer.ownerId;
    return await ctx.db
      .query("buildings")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", ownerId))
      .collect();
  }

  return [];
}

async function requireOwnerInOrganization(
  ctx: { db: { get: (id: Id<"owners">) => Promise<Doc<"owners"> | null> } },
  organizationId: Id<"organizations">,
  ownerId: Id<"owners">
) {
  const owner = await ctx.db.get(ownerId);
  if (owner === null || owner.organizationId !== organizationId) {
    raise(ERROR_CODES.NOT_PERMITTED);
  }
  return owner;
}

export const create = staffMutation({
  args: {
    name: v.string(),
    street: v.string(),
    area: v.string(),
    ownerId: v.optional(v.id("owners")),
    newOwner: v.optional(
      v.object({
        displayName: v.string(),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
      })
    ),
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

    if (args.ownerId !== undefined && args.newOwner !== undefined) {
      raise(ERROR_CODES.INVALID, "Pick an owner or add a new one, not both");
    }

    let ownerId = args.ownerId;
    if (args.ownerId !== undefined) {
      await requireOwnerInOrganization(ctx, organizationId, args.ownerId);
    }
    if (args.newOwner !== undefined) {
      ownerId = await insertOwnerForOrg(ctx, organizationId, args.newOwner);
    }

    return await ctx.db.insert("buildings", {
      organizationId,
      name,
      address: formatAccraAddress(street, area),
      ...(ownerId !== undefined ? { ownerId } : {}),
    });
  },
});

const buildingFormFields = v.object({
  _id: v.id("buildings"),
  name: v.string(),
  street: v.string(),
  area: v.string(),
  address: v.string(),
  ownerId: v.union(v.id("owners"), v.null()),
  ownerName: v.union(v.string(), v.null()),
});

export const get = authedQuery({
  args: {
    buildingId: v.id("buildings"),
  },
  returns: buildingFormFields,
  handler: async (ctx, args) => {
    const building = await requireBuildingAccess(
      ctx,
      ctx.viewer,
      args.buildingId
    );

    const { street, area } = parseAccraAddress(building.address);
    const owner =
      building.ownerId === undefined
        ? null
        : await ctx.db.get(building.ownerId);

    return {
      _id: building._id,
      name: building.name,
      street,
      area,
      address: building.address,
      ownerId: owner?._id ?? null,
      ownerName: owner?.displayName ?? null,
    };
  },
});

export const update = staffMutation({
  args: {
    buildingId: v.id("buildings"),
    name: v.string(),
    street: v.string(),
    area: v.string(),
    ownerId: v.optional(v.id("owners")),
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

    if (args.ownerId !== undefined) {
      await requireOwnerInOrganization(ctx, organizationId, args.ownerId);
    }

    await ctx.db.patch(args.buildingId, {
      name,
      address: formatAccraAddress(street, area),
      ...(args.ownerId !== undefined ? { ownerId: args.ownerId } : {}),
    });
    return null;
  },
});

export const assignOwner = staffMutation({
  args: {
    buildingId: v.id("buildings"),
    ownerId: v.id("owners"),
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

    await requireOwnerInOrganization(ctx, organizationId, args.ownerId);
    await ctx.db.patch(args.buildingId, { ownerId: args.ownerId });
    return null;
  },
});
