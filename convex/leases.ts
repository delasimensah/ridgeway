import { v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
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

export async function insertLeaseWithTenant(
  ctx: MutationCtx,
  viewer: Viewer,
  unitId: Id<"units">,
  args: {
    displayName: string;
    email: string;
    phone?: string;
    startedOn: string;
    endedOn?: string;
  }
): Promise<Id<"leases">> {
  const { unit } = await requireUnitInStaffOrg(ctx, viewer, unitId);

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
}

async function requireAvailableTenantInOrg(
  ctx: Pick<MutationCtx, "db">,
  organizationId: Id<"organizations">,
  tenantProfileId: Id<"profiles">
) {
  const profile = await ctx.db.get(tenantProfileId);
  if (profile === null) {
    raise(ERROR_CODES.NOT_PERMITTED);
  }
  if (await profileHasMembership(ctx, profile._id)) {
    raise(
      ERROR_CODES.INVALID,
      "That email already belongs to someone on staff"
    );
  }
  const today = utcToday();
  const current = await currentLeaseForProfile(ctx, profile._id, today);
  if (current !== null) {
    raise(ERROR_CODES.INVALID, "This person already has a current lease");
  }

  const pastLeases = await ctx.db
    .query("leases")
    .withIndex("by_tenantProfileId", (q) =>
      q.eq("tenantProfileId", profile._id)
    )
    .collect();
  for (const lease of pastLeases) {
    const unit = await ctx.db.get(lease.unitId);
    if (unit === null) {
      continue;
    }
    const building = await ctx.db.get(unit.buildingId);
    if (building?.organizationId === organizationId) {
      return profile;
    }
  }

  raise(ERROR_CODES.NOT_PERMITTED);
}

export async function insertLeaseForExistingTenant(
  ctx: MutationCtx,
  viewer: Viewer,
  unitId: Id<"units">,
  args: {
    tenantProfileId: Id<"profiles">;
    startedOn: string;
    endedOn?: string;
  }
): Promise<Id<"leases">> {
  const { unit, building } = await requireUnitInStaffOrg(ctx, viewer, unitId);
  const startedOn = requireCalendarDate(args.startedOn, "Lease start");
  const endedOn = optionalCalendarDate(args.endedOn, "Lease end");
  validateLeaseDates(startedOn, endedOn);

  const today = utcToday();
  const occupied = await currentLeaseForUnit(ctx, unit._id, today);
  if (occupied !== null) {
    raise(ERROR_CODES.INVALID, "This unit already has a current lease");
  }

  const profile = await requireAvailableTenantInOrg(
    ctx,
    building.organizationId,
    args.tenantProfileId
  );

  return await ctx.db.insert("leases", {
    unitId: unit._id,
    tenantProfileId: profile._id,
    startedOn,
    ...(endedOn !== undefined ? { endedOn } : {}),
  });
}

const availableTenant = v.object({
  _id: v.id("profiles"),
  displayName: v.string(),
});

export const listAvailableForStaff = staffQuery({
  args: {},
  returns: v.array(availableTenant),
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
    const today = utcToday();
    const names = new Map<Id<"profiles">, string>();

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
          const profile = await ctx.db.get(lease.tenantProfileId);
          if (profile !== null) {
            names.set(profile._id, profile.displayName);
          }
        }
      }
    }

    const available: { _id: Id<"profiles">; displayName: string }[] = [];
    for (const [profileId, displayName] of names) {
      if (await profileHasMembership(ctx, profileId)) {
        continue;
      }
      const current = await currentLeaseForProfile(ctx, profileId, today);
      if (current !== null) {
        continue;
      }
      available.push({ _id: profileId, displayName });
    }

    available.sort((left, right) =>
      left.displayName.localeCompare(right.displayName)
    );
    return available;
  },
});

export const createWithTenant = staffMutation({
  args: {
    unitId: v.id("units"),
    ...tenantFields,
  },
  returns: v.id("leases"),
  handler: async (ctx, args) => {
    return await insertLeaseWithTenant(ctx, ctx.viewer, args.unitId, {
      displayName: args.displayName,
      email: args.email,
      phone: args.phone,
      startedOn: args.startedOn,
      endedOn: args.endedOn,
    });
  },
});

export const createForExistingTenant = staffMutation({
  args: {
    unitId: v.id("units"),
    tenantProfileId: v.id("profiles"),
    startedOn: v.string(),
    endedOn: v.optional(v.string()),
  },
  returns: v.id("leases"),
  handler: async (ctx, args) => {
    return await insertLeaseForExistingTenant(ctx, ctx.viewer, args.unitId, {
      tenantProfileId: args.tenantProfileId,
      startedOn: args.startedOn,
      endedOn: args.endedOn,
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
