import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import type { Doc, Id } from "../_generated/dataModel";
import { internalQuery, type QueryCtx } from "../_generated/server";
import { ERROR_CODES, raise } from "./errors";

export type Viewer = {
  userId: Id<"users">;
  profile: Doc<"profiles">;
  organizationId: Id<"organizations"> | null;
  isStaff: boolean;
  isField: boolean;
  ownerId: Id<"owners"> | null;
};

export async function resolveViewerByUserId(
  ctx: QueryCtx,
  userId: Id<"users">
): Promise<Viewer> {
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
  if (profile === null) {
    raise(ERROR_CODES.UNAUTHENTICATED);
  }

  const memberships = await ctx.db
    .query("memberships")
    .withIndex("by_profileId", (q) => q.eq("profileId", profile._id))
    .take(8);

  const staffMembership = memberships.find((row) => row.role === "staff");
  const fieldMembership = memberships.find((row) => row.role === "field");
  const ownerMembership = memberships.find((row) => row.role === "owner");
  const organizationId =
    staffMembership?.organizationId ??
    fieldMembership?.organizationId ??
    ownerMembership?.organizationId ??
    memberships[0]?.organizationId ??
    null;

  return {
    userId,
    profile,
    organizationId,
    isStaff: staffMembership !== undefined,
    isField: fieldMembership !== undefined,
    ownerId: ownerMembership?.ownerId ?? null,
  };
}

export async function resolveViewer(ctx: QueryCtx): Promise<Viewer> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    raise(ERROR_CODES.UNAUTHENTICATED);
  }

  return await resolveViewerByUserId(ctx, userId);
}

export const requireStaffByUserId = internalQuery({
  args: {
    userId: v.id("users"),
  },
  returns: v.object({
    userId: v.id("users"),
    profileId: v.id("profiles"),
    organizationId: v.id("organizations"),
  }),
  handler: async (ctx, args) => {
    const viewer = await resolveViewerByUserId(ctx, args.userId);
    if (!viewer.isStaff || viewer.organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    return {
      userId: viewer.userId,
      profileId: viewer.profile._id,
      organizationId: viewer.organizationId,
    };
  },
});

export async function requireStaff(ctx: QueryCtx): Promise<Viewer> {
  const viewer = await resolveViewer(ctx);
  if (!viewer.isStaff) {
    raise(ERROR_CODES.NOT_PERMITTED);
  }
  return viewer;
}

const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isCalendarDate(value: string): boolean {
  const match = CALENDAR_DATE.exec(value);
  if (match === null) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isLeaseCurrent(
  lease: { endedOn?: string },
  today: string
): boolean {
  return lease.endedOn === undefined || lease.endedOn >= today;
}

export async function currentLeaseForProfile(
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

export async function requireBuildingAccess(
  ctx: { db: QueryCtx["db"] },
  viewer: Viewer,
  buildingId: Id<"buildings">
): Promise<Doc<"buildings">> {
  const building = await ctx.db.get(buildingId);
  if (building === null) {
    raise(ERROR_CODES.NOT_PERMITTED);
  }

  if (viewer.isStaff && viewer.organizationId === building.organizationId) {
    return building;
  }

  if (
    viewer.ownerId !== null &&
    building.ownerId !== undefined &&
    viewer.ownerId === building.ownerId
  ) {
    return building;
  }

  const lease = await currentLeaseForProfile(
    ctx,
    viewer.profile._id,
    utcToday()
  );
  if (lease !== null) {
    const unit = await ctx.db.get(lease.unitId);
    if (unit !== null && unit.buildingId === buildingId) {
      return building;
    }
  }

  raise(ERROR_CODES.NOT_PERMITTED);
}

export async function requireWorkOrderAccess(
  ctx: { db: QueryCtx["db"] },
  viewer: Viewer,
  workOrderId: Id<"workOrders">,
  intent: "read" | "write"
): Promise<Doc<"workOrders">> {
  const ticket = await ctx.db.get(workOrderId);
  if (ticket === null) {
    raise(ERROR_CODES.NOT_PERMITTED);
  }

  if (viewer.isStaff && viewer.organizationId === ticket.organizationId) {
    return ticket;
  }

  if (viewer.ownerId !== null) {
    const building = await ctx.db.get(ticket.buildingId);
    if (
      building !== null &&
      building.ownerId !== undefined &&
      building.ownerId === viewer.ownerId
    ) {
      if (intent === "write") {
        raise(ERROR_CODES.NOT_PERMITTED);
      }
      return ticket;
    }
  }

  const lease = await currentLeaseForProfile(
    ctx,
    viewer.profile._id,
    utcToday()
  );
  if (viewer.isField && ticket.assigneeProfileId === viewer.profile._id) {
    return ticket;
  }

  if (lease !== null && ticket.leaseId === lease._id) {
    return ticket;
  }

  raise(ERROR_CODES.NOT_PERMITTED);
}
