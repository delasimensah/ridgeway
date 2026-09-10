import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { ERROR_CODES, raise } from "./lib/errors";
import { authedQuery } from "./lib/functions";
import { currentLeaseForProfile, utcToday } from "./lib/viewer";

const currentLeaseValidator = v.object({
  leaseId: v.id("leases"),
  unitId: v.id("units"),
  buildingId: v.id("buildings"),
  unitLabel: v.string(),
  buildingName: v.string(),
  address: v.string(),
});

const currentViewerValidator = v.object({
  profileId: v.id("profiles"),
  displayName: v.string(),
  phone: v.union(v.string(), v.null()),
  organizationId: v.union(v.id("organizations"), v.null()),
  isStaff: v.boolean(),
  isField: v.boolean(),
  ownerId: v.union(v.id("owners"), v.null()),
  currentLease: v.union(currentLeaseValidator, v.null()),
});

export const getCurrent = authedQuery({
  args: {},
  returns: currentViewerValidator,
  handler: async (ctx) => {
    const lease = await currentLeaseForProfile(
      ctx,
      ctx.viewer.profile._id,
      utcToday()
    );
    let currentLease: {
      leaseId: Id<"leases">;
      unitId: Id<"units">;
      buildingId: Id<"buildings">;
      unitLabel: string;
      buildingName: string;
      address: string;
    } | null = null;

    if (lease !== null) {
      const unit = await ctx.db.get(lease.unitId);
      const building = unit === null ? null : await ctx.db.get(unit.buildingId);
      if (unit !== null && building !== null) {
        currentLease = {
          leaseId: lease._id,
          unitId: unit._id,
          buildingId: building._id,
          unitLabel: unit.label,
          buildingName: building.name,
          address: building.address,
        };
      }
    }

    return {
      profileId: ctx.viewer.profile._id,
      displayName: ctx.viewer.profile.displayName,
      phone: ctx.viewer.profile.phone ?? null,
      organizationId: ctx.viewer.organizationId,
      isStaff: ctx.viewer.isStaff,
      isField: ctx.viewer.isField,
      ownerId: ctx.viewer.ownerId,
      currentLease,
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
