import { createAccount } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import {
  passwordAccountId,
  requirePassword,
  setAccountPassword,
} from "./lib/accountPassword";
import { ERROR_CODES, raise } from "./lib/errors";
import { staffAction, staffMutation, staffQuery } from "./lib/functions";
import { requireBuildingAccess } from "./lib/viewer";

const EMAIL_TAKEN = "That email already belongs to someone who can sign in";
const LOGIN_ALREADY_GRANTED = "This owner already has a login";
const LOGIN_NOT_GRANTED = "This owner does not have a login yet";
const EMAIL_REQUIRED_FOR_LOGIN = "Email is required to give a login";

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

function optionalEmail(value: string | undefined): string | undefined {
  const trimmed = optionalText(value);
  if (trimmed === undefined) {
    return undefined;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    raise(ERROR_CODES.INVALID, "Enter a valid email");
  }
  return trimmed.toLowerCase();
}

function requireEmail(value: string): string {
  const email = optionalEmail(value);
  if (email === undefined) {
    raise(ERROR_CODES.INVALID, EMAIL_REQUIRED_FOR_LOGIN);
  }
  return email;
}

async function ownerIdsWithLogin(
  ctx: { db: QueryCtx["db"] },
  organizationId: Id<"organizations">
): Promise<Set<Id<"owners">>> {
  const memberships = await ctx.db
    .query("memberships")
    .withIndex("by_organizationId_and_role", (q) =>
      q.eq("organizationId", organizationId).eq("role", "owner")
    )
    .collect();
  const ids = new Set<Id<"owners">>();
  for (const row of memberships) {
    if (row.ownerId !== undefined) {
      ids.add(row.ownerId);
    }
  }
  return ids;
}

async function ownerHasLogin(
  ctx: { db: QueryCtx["db"] },
  organizationId: Id<"organizations">,
  ownerId: Id<"owners">
): Promise<boolean> {
  const ids = await ownerIdsWithLogin(ctx, organizationId);
  return ids.has(ownerId);
}

export async function insertOwnerForOrg(
  ctx: Pick<MutationCtx, "db">,
  organizationId: Id<"organizations">,
  args: {
    displayName: string;
    contactEmail?: string;
    contactPhone?: string;
  }
): Promise<Id<"owners">> {
  const displayName = requireText(args.displayName, "Full name");
  const contactEmail = optionalEmail(args.contactEmail);
  const contactPhone = optionalText(args.contactPhone);

  return await ctx.db.insert("owners", {
    organizationId,
    displayName,
    ...(contactEmail !== undefined ? { contactEmail } : {}),
    ...(contactPhone !== undefined ? { contactPhone } : {}),
  });
}

const ownerBuildingSummary = v.object({
  _id: v.id("buildings"),
  name: v.string(),
  address: v.string(),
});

const ownerListItem = v.object({
  _id: v.id("owners"),
  displayName: v.string(),
  contactEmail: v.union(v.string(), v.null()),
  contactPhone: v.union(v.string(), v.null()),
  hasLogin: v.boolean(),
  buildingCount: v.number(),
});

const ownerFormFields = v.object({
  _id: v.id("owners"),
  displayName: v.string(),
  contactEmail: v.union(v.string(), v.null()),
  contactPhone: v.union(v.string(), v.null()),
  hasLogin: v.boolean(),
  buildings: v.array(ownerBuildingSummary),
});

export const listForStaff = staffQuery({
  args: {},
  returns: v.array(ownerListItem),
  handler: async (ctx) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const rows = await ctx.db
      .query("owners")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .collect();

    const logins = await ownerIdsWithLogin(ctx, organizationId);
    const buildings = await ctx.db
      .query("buildings")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .collect();
    const buildingCounts = new Map<Id<"owners">, number>();
    for (const building of buildings) {
      if (building.ownerId === undefined) {
        continue;
      }
      buildingCounts.set(
        building.ownerId,
        (buildingCounts.get(building.ownerId) ?? 0) + 1
      );
    }

    return rows.map((row) => ({
      _id: row._id,
      displayName: row.displayName,
      contactEmail: row.contactEmail ?? null,
      contactPhone: row.contactPhone ?? null,
      hasLogin: logins.has(row._id),
      buildingCount: buildingCounts.get(row._id) ?? 0,
    }));
  },
});

export const get = staffQuery({
  args: {
    ownerId: v.id("owners"),
  },
  returns: v.union(ownerFormFields, v.null()),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const owner = await ctx.db.get(args.ownerId);
    if (owner === null || owner.organizationId !== organizationId) {
      return null;
    }

    const ownedBuildings = await ctx.db
      .query("buildings")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", owner._id))
      .collect();
    const buildings = ownedBuildings
      .map((building) => ({
        _id: building._id,
        name: building.name,
        address: building.address,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      _id: owner._id,
      displayName: owner.displayName,
      contactEmail: owner.contactEmail ?? null,
      contactPhone: owner.contactPhone ?? null,
      hasLogin: await ownerHasLogin(ctx, organizationId, owner._id),
      buildings,
    };
  },
});

export const create = staffMutation({
  args: {
    displayName: v.string(),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    buildingId: v.optional(v.id("buildings")),
  },
  returns: v.id("owners"),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    if (args.buildingId !== undefined) {
      const building = await requireBuildingAccess(
        ctx,
        ctx.viewer,
        args.buildingId
      );
      if (building.organizationId !== organizationId) {
        raise(ERROR_CODES.NOT_PERMITTED);
      }
    }

    const ownerId = await insertOwnerForOrg(ctx, organizationId, {
      displayName: args.displayName,
      contactEmail: args.contactEmail,
      contactPhone: args.contactPhone,
    });

    if (args.buildingId !== undefined) {
      await ctx.db.patch(args.buildingId, { ownerId });
    }

    return ownerId;
  },
});

export const update = staffMutation({
  args: {
    ownerId: v.id("owners"),
    displayName: v.string(),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const owner = await ctx.db.get(args.ownerId);
    if (owner === null || owner.organizationId !== organizationId) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const displayName = requireText(args.displayName, "Full name");
    const contactEmail = optionalEmail(args.contactEmail);
    const contactPhone = optionalText(args.contactPhone);

    await ctx.db.patch(args.ownerId, {
      displayName,
      ...(contactEmail !== undefined ? { contactEmail } : {}),
      ...(contactPhone !== undefined ? { contactPhone } : {}),
    });
    return null;
  },
});

export const grantMembership = staffMutation({
  args: {
    ownerId: v.id("owners"),
    profileId: v.id("profiles"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const owner = await ctx.db.get(args.ownerId);
    if (owner === null || owner.organizationId !== organizationId) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const profile = await ctx.db.get(args.profileId);
    if (profile === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .take(8);
    if (memberships.some((row) => row.role === "owner")) {
      raise(ERROR_CODES.INVALID, "This person already acts for an owner");
    }

    await ctx.db.insert("memberships", {
      organizationId,
      profileId: args.profileId,
      role: "owner",
      ownerId: args.ownerId,
    });
    return null;
  },
});

export const getForStaffOrg = internalQuery({
  args: {
    organizationId: v.id("organizations"),
    ownerId: v.id("owners"),
  },
  returns: v.union(
    v.object({
      _id: v.id("owners"),
      hasLogin: v.boolean(),
      loginEmail: v.union(v.string(), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const owner = await ctx.db.get(args.ownerId);
    if (owner === null || owner.organizationId !== args.organizationId) {
      return null;
    }

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_organizationId_and_role", (q) =>
        q.eq("organizationId", args.organizationId).eq("role", "owner")
      )
      .collect();
    const membership = memberships.find((row) => row.ownerId === args.ownerId);
    if (membership === undefined) {
      return { _id: owner._id, hasLogin: false, loginEmail: null };
    }

    const profile = await ctx.db.get(membership.profileId);
    if (profile === null) {
      return { _id: owner._id, hasLogin: true, loginEmail: null };
    }

    return {
      _id: owner._id,
      hasLogin: true,
      loginEmail: await passwordAccountId(ctx, profile.userId),
    };
  },
});

export const getBuildingInOrg = internalQuery({
  args: {
    organizationId: v.id("organizations"),
    buildingId: v.id("buildings"),
  },
  returns: v.union(v.id("buildings"), v.null()),
  handler: async (ctx, args) => {
    const building = await ctx.db.get(args.buildingId);
    if (building === null || building.organizationId !== args.organizationId) {
      return null;
    }

    return building._id;
  },
});

export const attachLogin = internalMutation({
  args: {
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    ownerId: v.optional(v.id("owners")),
    displayName: v.string(),
    contactEmail: v.string(),
    contactPhone: v.optional(v.string()),
    buildingId: v.optional(v.id("buildings")),
  },
  returns: v.id("owners"),
  handler: async (ctx, args) => {
    const displayName = requireText(args.displayName, "Full name");
    const contactEmail = requireEmail(args.contactEmail);
    const contactPhone = optionalText(args.contactPhone);

    let ownerId = args.ownerId;
    if (ownerId !== undefined) {
      const owner = await ctx.db.get(ownerId);
      if (owner === null || owner.organizationId !== args.organizationId) {
        raise(ERROR_CODES.NOT_PERMITTED);
      }
      if (await ownerHasLogin(ctx, args.organizationId, ownerId)) {
        raise(ERROR_CODES.INVALID, LOGIN_ALREADY_GRANTED);
      }
      await ctx.db.patch(ownerId, {
        displayName,
        contactEmail,
        ...(contactPhone !== undefined ? { contactPhone } : {}),
      });
    } else {
      ownerId = await insertOwnerForOrg(ctx, args.organizationId, {
        displayName,
        contactEmail,
        contactPhone,
      });
    }

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (existingProfile !== null) {
      raise(ERROR_CODES.INVALID, EMAIL_TAKEN);
    }

    const profileId = await ctx.db.insert("profiles", {
      userId: args.userId,
      displayName,
      ...(contactPhone !== undefined ? { phone: contactPhone } : {}),
    });

    await ctx.db.insert("memberships", {
      organizationId: args.organizationId,
      profileId,
      role: "owner",
      ownerId,
    });

    if (args.buildingId !== undefined) {
      const building = await ctx.db.get(args.buildingId);
      if (
        building === null ||
        building.organizationId !== args.organizationId
      ) {
        raise(ERROR_CODES.NOT_PERMITTED);
      }
      await ctx.db.patch(args.buildingId, { ownerId });
    }

    return ownerId;
  },
});

export const grantLogin = staffAction({
  args: {
    ownerId: v.optional(v.id("owners")),
    displayName: v.string(),
    contactEmail: v.string(),
    contactPhone: v.optional(v.string()),
    password: v.string(),
    buildingId: v.optional(v.id("buildings")),
  },
  returns: v.id("owners"),
  handler: async (ctx, args): Promise<Id<"owners">> => {
    const viewer: {
      userId: Id<"users">;
      profileId: Id<"profiles">;
      organizationId: Id<"organizations">;
    } = await ctx.runQuery(internal.lib.viewer.requireStaffByUserId, {
      userId: ctx.staffUserId,
    });
    const displayName = requireText(args.displayName, "Full name");
    const contactEmail = requireEmail(args.contactEmail);
    const password = requirePassword(args.password);
    const contactPhone = optionalText(args.contactPhone);

    const existingUser = await ctx.runQuery(internal.seed.findUserByEmail, {
      email: contactEmail,
    });
    if (existingUser !== null) {
      raise(ERROR_CODES.INVALID, EMAIL_TAKEN);
    }

    if (args.ownerId !== undefined) {
      const owner = await ctx.runQuery(internal.owners.getForStaffOrg, {
        organizationId: viewer.organizationId,
        ownerId: args.ownerId,
      });
      if (owner === null) {
        raise(ERROR_CODES.NOT_PERMITTED);
      }
      if (owner.hasLogin) {
        raise(ERROR_CODES.INVALID, LOGIN_ALREADY_GRANTED);
      }
    }

    if (args.buildingId !== undefined) {
      const building = await ctx.runQuery(internal.owners.getBuildingInOrg, {
        organizationId: viewer.organizationId,
        buildingId: args.buildingId,
      });
      if (building === null) {
        raise(ERROR_CODES.NOT_PERMITTED);
      }
    }

    const created = await createAccount(ctx as never, {
      provider: "password",
      account: { id: contactEmail, secret: password },
      profile: { email: contactEmail, name: displayName },
    });

    return await ctx.runMutation(internal.owners.attachLogin, {
      organizationId: viewer.organizationId,
      userId: created.user._id,
      ownerId: args.ownerId,
      displayName,
      contactEmail,
      contactPhone,
      buildingId: args.buildingId,
    });
  },
});

export const setPassword = staffAction({
  args: {
    ownerId: v.id("owners"),
    password: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args): Promise<null> => {
    const viewer: {
      userId: Id<"users">;
      profileId: Id<"profiles">;
      organizationId: Id<"organizations">;
    } = await ctx.runQuery(internal.lib.viewer.requireStaffByUserId, {
      userId: ctx.staffUserId,
    });
    const password = requirePassword(args.password);
    const owner = await ctx.runQuery(internal.owners.getForStaffOrg, {
      organizationId: viewer.organizationId,
      ownerId: args.ownerId,
    });
    if (owner === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }
    if (owner.loginEmail === null) {
      raise(ERROR_CODES.INVALID, LOGIN_NOT_GRANTED);
    }
    await setAccountPassword(ctx, owner.loginEmail, password);
    return null;
  },
});
