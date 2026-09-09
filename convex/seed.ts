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
import { formatAccraAddress } from "./buildings";

export const ORGANIZATION_NAME = "Ridgeway Property Group";

export const STAFF_SEED = {
  email: "ama.boateng@ridgeway.gh",
  displayName: "Ama Boateng",
} as const;

export const FIELD_SEED = {
  email: "yaw.darko@ridgeway.gh",
  displayName: "Yaw Darko",
} as const;

export const OWNER_A_SEED = {
  email: "kwesi.mensah@ridgeway.gh",
  displayName: "Kwesi Mensah",
  buildingName: "Ridge Court",
  street: "14 Ridge Road",
  area: "Cantonments",
} as const;

export const OWNER_B_SEED = {
  email: "adwoa.owusu@ridgeway.gh",
  displayName: "Adwoa Owusu",
  buildingName: "Labone walk-up",
  street: "32 Labone Crescent",
  area: "Labone",
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
    role: v.union(v.literal("staff"), v.literal("field"), v.literal("owner")),
    organizationName: v.string(),
    ownerId: v.optional(v.id("owners")),
  },
  returns: v.object({
    organizationId: v.id("organizations"),
    profileId: v.id("profiles"),
  }),
  handler: async (ctx, args) => {
    if (args.role === "owner" && args.ownerId === undefined) {
      throw new Error("Owner identity needs an owner id");
    }

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
        ...(args.ownerId !== undefined ? { ownerId: args.ownerId } : {}),
      });
    }

    return { organizationId, profileId };
  },
});

export const ensureOwner = internalMutation({
  args: {
    displayName: v.string(),
    contactEmail: v.string(),
    organizationName: v.string(),
  },
  returns: v.id("owners"),
  handler: async (ctx, args) => {
    const existingOrgs = await ctx.db.query("organizations").take(1);
    const organizationId =
      existingOrgs[0]?._id ??
      (await ctx.db.insert("organizations", { name: args.organizationName }));

    const owners = await ctx.db
      .query("owners")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .collect();
    const existing = owners.find(
      (row) => row.contactEmail === args.contactEmail
    );
    if (existing !== undefined) {
      return existing._id;
    }

    return await ctx.db.insert("owners", {
      organizationId,
      displayName: args.displayName,
      contactEmail: args.contactEmail,
    });
  },
});

export const ensureBuildingForOwner = internalMutation({
  args: {
    ownerId: v.id("owners"),
    name: v.string(),
    street: v.string(),
    area: v.string(),
  },
  returns: v.id("buildings"),
  handler: async (ctx, args) => {
    const owner = await ctx.db.get(args.ownerId);
    if (owner === null) {
      throw new Error("Owner does not exist");
    }

    const buildings = await ctx.db
      .query("buildings")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", args.ownerId))
      .collect();
    const existing = buildings.find((row) => row.name === args.name);
    if (existing !== undefined) {
      return existing._id;
    }

    return await ctx.db.insert("buildings", {
      organizationId: owner.organizationId,
      ownerId: args.ownerId,
      name: args.name,
      address: formatAccraAddress(args.street, args.area),
    });
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
    ownerAPassword: v.string(),
    ownerBPassword: v.string(),
  },
  returns: v.object({
    staffEmail: v.string(),
    fieldEmail: v.string(),
    ownerAEmail: v.string(),
    ownerBEmail: v.string(),
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
    const ownerAUserId = await ensureAccount(
      ctx,
      OWNER_A_SEED.email,
      args.ownerAPassword,
      OWNER_A_SEED.displayName
    );
    const ownerBUserId = await ensureAccount(
      ctx,
      OWNER_B_SEED.email,
      args.ownerBPassword,
      OWNER_B_SEED.displayName
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

    const ownerAId = await ctx.runMutation(internal.seed.ensureOwner, {
      displayName: OWNER_A_SEED.displayName,
      contactEmail: OWNER_A_SEED.email,
      organizationName: ORGANIZATION_NAME,
    });
    const ownerBId = await ctx.runMutation(internal.seed.ensureOwner, {
      displayName: OWNER_B_SEED.displayName,
      contactEmail: OWNER_B_SEED.email,
      organizationName: ORGANIZATION_NAME,
    });

    await ctx.runMutation(internal.seed.attachIdentity, {
      userId: ownerAUserId,
      displayName: OWNER_A_SEED.displayName,
      role: "owner",
      organizationName: ORGANIZATION_NAME,
      ownerId: ownerAId,
    });
    await ctx.runMutation(internal.seed.attachIdentity, {
      userId: ownerBUserId,
      displayName: OWNER_B_SEED.displayName,
      role: "owner",
      organizationName: ORGANIZATION_NAME,
      ownerId: ownerBId,
    });

    await ctx.runMutation(internal.seed.ensureBuildingForOwner, {
      ownerId: ownerAId,
      name: OWNER_A_SEED.buildingName,
      street: OWNER_A_SEED.street,
      area: OWNER_A_SEED.area,
    });
    await ctx.runMutation(internal.seed.ensureBuildingForOwner, {
      ownerId: ownerBId,
      name: OWNER_B_SEED.buildingName,
      street: OWNER_B_SEED.street,
      area: OWNER_B_SEED.area,
    });

    return {
      staffEmail: STAFF_SEED.email,
      fieldEmail: FIELD_SEED.email,
      ownerAEmail: OWNER_A_SEED.email,
      ownerBEmail: OWNER_B_SEED.email,
    };
  },
});
