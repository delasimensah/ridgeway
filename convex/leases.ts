import { v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { ERROR_CODES, raise } from "./lib/errors";
import { staffMutation, staffQuery } from "./lib/functions";
import {
  isCalendarDate,
  isLeaseCurrent,
  requireBuildingAccess,
  utcToday,
  type Viewer,
} from "./lib/viewer";

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

function requireEmail(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    raise(ERROR_CODES.INVALID, "Enter a valid email");
  }
  return trimmed;
}

function requireCalendarDate(value: string, field: string): string {
  const trimmed = value.trim();
  if (!isCalendarDate(trimmed)) {
    raise(ERROR_CODES.INVALID, `${field} must be a calendar date`);
  }
  return trimmed;
}

function optionalCalendarDate(
  value: string | undefined,
  field: string
): string | undefined {
  const trimmed = optionalText(value);
  if (trimmed === undefined) {
    return undefined;
  }
  return requireCalendarDate(trimmed, field);
}

const tenantFields = {
  displayName: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  startedOn: v.string(),
  endedOn: v.optional(v.string()),
};

const leaseFormFields = v.object({
  _id: v.id("leases"),
  unitId: v.id("units"),
  buildingId: v.id("buildings"),
  displayName: v.string(),
  email: v.string(),
  phone: v.union(v.string(), v.null()),
  startedOn: v.string(),
  endedOn: v.union(v.string(), v.null()),
});

async function requireUnitInStaffOrg(
  ctx: { db: QueryCtx["db"] },
  viewer: Viewer,
  unitId: Id<"units">
) {
  const unit = await ctx.db.get(unitId);
  if (unit === null) {
    raise(ERROR_CODES.NOT_PERMITTED);
  }
  const building = await requireBuildingAccess(ctx, viewer, unit.buildingId);
  return { unit, building };
}

async function currentLeaseForUnit(
  ctx: { db: QueryCtx["db"] },
  unitId: Id<"units">,
  today: string
): Promise<Doc<"leases"> | null> {
  const rows = await ctx.db
    .query("leases")
    .withIndex("by_unitId", (q) => q.eq("unitId", unitId))
    .collect();
  return rows.find((row) => isLeaseCurrent(row, today)) ?? null;
}

async function currentLeaseForProfile(
  ctx: { db: QueryCtx["db"] },
  tenantProfileId: Id<"profiles">,
  today: string
): Promise<Doc<"leases"> | null> {
  const rows = await ctx.db
    .query("leases")
    .withIndex("by_tenantProfileId", (q) =>
      q.eq("tenantProfileId", tenantProfileId)
    )
    .collect();
  return rows.find((row) => isLeaseCurrent(row, today)) ?? null;
}

function validateLeaseDates(startedOn: string, endedOn: string | undefined) {
  const today = utcToday();
  if (startedOn > today) {
    raise(ERROR_CODES.INVALID, "Lease start must be today or earlier");
  }
  if (endedOn !== undefined && endedOn < startedOn) {
    raise(ERROR_CODES.INVALID, "Lease end cannot be before the start date");
  }
}

async function findUserByEmail(ctx: { db: QueryCtx["db"] }, email: string) {
  return await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .unique();
}

async function profileHasMembership(
  ctx: { db: QueryCtx["db"] },
  profileId: Id<"profiles">
) {
  const memberships = await ctx.db
    .query("memberships")
    .withIndex("by_profileId", (q) => q.eq("profileId", profileId))
    .take(8);
  return memberships.length > 0;
}

export const get = staffQuery({
  args: {
    leaseId: v.id("leases"),
  },
  returns: v.union(leaseFormFields, v.null()),
  handler: async (ctx, args) => {
    const lease = await ctx.db.get(args.leaseId);
    if (lease === null) {
      return null;
    }

    const unit = await ctx.db.get(lease.unitId);
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

    const profile = await ctx.db.get(lease.tenantProfileId);
    if (profile === null) {
      return null;
    }

    const user = await ctx.db.get(profile.userId);
    if (user === null || user.email === undefined) {
      return null;
    }

    return {
      _id: lease._id,
      unitId: lease.unitId,
      buildingId: unit.buildingId,
      displayName: profile.displayName,
      email: user.email,
      phone: profile.phone ?? null,
      startedOn: lease.startedOn,
      endedOn: lease.endedOn ?? null,
    };
  },
});

export const createWithTenant = staffMutation({
  args: {
    unitId: v.id("units"),
    ...tenantFields,
  },
  returns: v.id("leases"),
  handler: async (ctx, args) => {
    const { unit } = await requireUnitInStaffOrg(ctx, ctx.viewer, args.unitId);

    const displayName = requireText(args.displayName, "Name");
    const email = requireEmail(args.email);
    const phone = optionalText(args.phone);
    const startedOn = requireCalendarDate(args.startedOn, "Lease start");
    const endedOn = optionalCalendarDate(args.endedOn, "Lease end");
    validateLeaseDates(startedOn, endedOn);

    const today = utcToday();
    const occupied = await currentLeaseForUnit(ctx, unit._id, today);
    if (occupied !== null) {
      raise(ERROR_CODES.INVALID, "This unit already has a current lease");
    }

    const existingUser = await findUserByEmail(ctx, email);
    let tenantProfileId: Id<"profiles">;

    if (existingUser !== null) {
      const existingProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", existingUser._id))
        .unique();
      if (existingProfile === null) {
        tenantProfileId = await ctx.db.insert("profiles", {
          userId: existingUser._id,
          displayName,
          ...(phone !== undefined ? { phone } : {}),
        });
      } else {
        if (await profileHasMembership(ctx, existingProfile._id)) {
          raise(
            ERROR_CODES.INVALID,
            "That email already belongs to someone on staff"
          );
        }
        const current = await currentLeaseForProfile(
          ctx,
          existingProfile._id,
          today
        );
        if (current !== null) {
          raise(ERROR_CODES.INVALID, "This person already has a current lease");
        }
        await ctx.db.patch(existingProfile._id, {
          displayName,
          ...(phone !== undefined ? { phone } : {}),
        });
        tenantProfileId = existingProfile._id;
      }
    } else {
      const userId = await ctx.db.insert("users", {
        email,
        name: displayName,
      });
      tenantProfileId = await ctx.db.insert("profiles", {
        userId,
        displayName,
        ...(phone !== undefined ? { phone } : {}),
      });
    }

    return await ctx.db.insert("leases", {
      unitId: unit._id,
      tenantProfileId,
      startedOn,
      ...(endedOn !== undefined ? { endedOn } : {}),
    });
  },
});

export const updateTenant = staffMutation({
  args: {
    leaseId: v.id("leases"),
    ...tenantFields,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const lease = await ctx.db.get(args.leaseId);
    if (lease === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    await requireUnitInStaffOrg(ctx, ctx.viewer, lease.unitId);

    const displayName = requireText(args.displayName, "Name");
    const email = requireEmail(args.email);
    const phone = optionalText(args.phone);
    const startedOn = requireCalendarDate(args.startedOn, "Lease start");
    const endedOn = optionalCalendarDate(args.endedOn, "Lease end");
    validateLeaseDates(startedOn, endedOn);

    const profile = await ctx.db.get(lease.tenantProfileId);
    if (profile === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const existingUser = await findUserByEmail(ctx, email);
    if (existingUser !== null && existingUser._id !== profile.userId) {
      raise(ERROR_CODES.INVALID, "That email already belongs to someone else");
    }

    await ctx.db.patch(profile.userId, {
      email,
      name: displayName,
    });
    await ctx.db.patch(profile._id, {
      displayName,
      ...(phone !== undefined ? { phone } : {}),
    });
    await ctx.db.patch(lease._id, {
      startedOn,
      ...(endedOn !== undefined ? { endedOn } : {}),
    });
    return null;
  },
});
