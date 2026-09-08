import { getAuthUserId } from "@convex-dev/auth/server";

import type { Doc, Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { ERROR_CODES, raise } from "./errors";

export type Viewer = {
  userId: Id<"users">;
  profile: Doc<"profiles">;
  organizationId: Id<"organizations"> | null;
  isStaff: boolean;
  isField: boolean;
};

export async function resolveViewer(ctx: QueryCtx): Promise<Viewer> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    raise(ERROR_CODES.UNAUTHENTICATED);
  }

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
  const organizationId =
    staffMembership?.organizationId ??
    fieldMembership?.organizationId ??
    memberships[0]?.organizationId ??
    null;

  return {
    userId,
    profile,
    organizationId,
    isStaff: staffMembership !== undefined,
    isField: fieldMembership !== undefined,
  };
}

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

  raise(ERROR_CODES.NOT_PERMITTED);
}
