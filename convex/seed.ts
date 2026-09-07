import { createAccount } from "@convex-dev/auth/server";
import type { GenericActionCtx } from "convex/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";

export const ORGANIZATION_NAME = "Ridgeway Property Group";

export const STAFF_SEED = {
  email: "ama.boateng@ridgeway.gh",
  displayName: "Ama Boateng",
} as const;

export const FIELD_SEED = {
  email: "yaw.darko@ridgeway.gh",
  displayName: "Yaw Darko",
} as const;

export const findUserByEmail = internalQuery({
  args: { email: v.string() },
  returns: v.union(v.id("users"), v.null()),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    return user?._id ?? null;
  },
});

export const attachIdentity = internalMutation({
  args: {
    userId: v.id("users"),
    displayName: v.string(),
    role: v.union(v.literal("staff"), v.literal("field")),
    organizationName: v.string(),
  },
  returns: v.object({
    organizationId: v.id("organizations"),
    profileId: v.id("profiles"),
  }),
  handler: async (ctx, args) => {
    const existingOrgs = await ctx.db.query("organizations").take(1);
    const organizationId =
      existingOrgs[0]?._id ??
      (await ctx.db.insert("organizations", { name: args.organizationName }));

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    const profileId =
      existingProfile?._id ??
      (await ctx.db.insert("profiles", {
        userId: args.userId,
        displayName: args.displayName,
      }));

    if (existingProfile && existingProfile.displayName !== args.displayName) {
      await ctx.db.patch(profileId, { displayName: args.displayName });
    }

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_profileId", (q) => q.eq("profileId", profileId))
      .take(8);
    const hasRole = memberships.some((row) => row.role === args.role);
    if (!hasRole) {
      await ctx.db.insert("memberships", {
        organizationId,
        profileId,
        role: args.role,
      });
    }

    return { organizationId, profileId };
  },
});

async function ensureAccount(
  ctx: GenericActionCtx<DataModel>,
  email: string,
  password: string,
  displayName: string
) {
  const existingUserId = await ctx.runQuery(internal.seed.findUserByEmail, {
    email,
  });
  if (existingUserId !== null) {
    return existingUserId;
  }

  const created = await createAccount(ctx as never, {
    provider: "password",
    account: { id: email, secret: password },
    profile: { email, name: displayName },
  });
  return created.user._id;
}

export const run = internalAction({
  args: {
    staffPassword: v.string(),
    fieldPassword: v.string(),
  },
  returns: v.object({
    staffEmail: v.string(),
    fieldEmail: v.string(),
  }),
  handler: async (ctx, args) => {
    const staffUserId = await ensureAccount(
      ctx,
      STAFF_SEED.email,
      args.staffPassword,
      STAFF_SEED.displayName
    );
    const fieldUserId = await ensureAccount(
      ctx,
      FIELD_SEED.email,
      args.fieldPassword,
      FIELD_SEED.displayName
    );

    await ctx.runMutation(internal.seed.attachIdentity, {
      userId: staffUserId,
      displayName: STAFF_SEED.displayName,
      role: "staff",
      organizationName: ORGANIZATION_NAME,
    });
    await ctx.runMutation(internal.seed.attachIdentity, {
      userId: fieldUserId,
      displayName: FIELD_SEED.displayName,
      role: "field",
      organizationName: ORGANIZATION_NAME,
    });

    return {
      staffEmail: STAFF_SEED.email,
      fieldEmail: FIELD_SEED.email,
    };
  },
});
