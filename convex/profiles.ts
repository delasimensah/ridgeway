import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { mutation } from "./_generated/server";
import { ERROR_CODES, raise } from "./lib/errors";
import { authedQuery } from "./lib/functions";

const currentViewerValidator = v.object({
  profileId: v.id("profiles"),
  displayName: v.string(),
  phone: v.union(v.string(), v.null()),
  organizationId: v.union(v.id("organizations"), v.null()),
  isStaff: v.boolean(),
  isField: v.boolean(),
  ownerId: v.union(v.id("owners"), v.null()),
});

export const getCurrent = authedQuery({
  args: {},
  returns: currentViewerValidator,
  handler: async (ctx) => {
    return {
      profileId: ctx.viewer.profile._id,
      displayName: ctx.viewer.profile.displayName,
      phone: ctx.viewer.profile.phone ?? null,
      organizationId: ctx.viewer.organizationId,
      isStaff: ctx.viewer.isStaff,
      isField: ctx.viewer.isField,
      ownerId: ctx.viewer.ownerId,
    };
  },
});

export const ensureForCurrentUser = mutation({
  args: {},
  returns: v.id("profiles"),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      raise(ERROR_CODES.UNAUTHENTICATED);
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (existing !== null) {
      return existing._id;
    }

    const user = await ctx.db.get(userId);
    const email = user?.email ?? "";
    const localPart = email.includes("@") ? email.split("@")[0] : "";
    const displayName = localPart.length > 0 ? localPart : "Member";

    return await ctx.db.insert("profiles", {
      userId,
      displayName,
    });
  },
});
