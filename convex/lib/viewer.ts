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
