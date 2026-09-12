import { createAccount } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  type QueryCtx,
} from "./_generated/server";
import {
  passwordAccountId,
  requirePassword,
  setAccountPassword,
} from "./lib/accountPassword";
import { ERROR_CODES, raise } from "./lib/errors";
import { staffAction, staffMutation, staffQuery } from "./lib/functions";

const EMAIL_TAKEN = "That email already belongs to someone who can sign in";
const LOGIN_NOT_GRANTED = "This person does not have a login yet";
const EMAIL_REQUIRED = "Email is required";

function requireText(value: string, field: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    raise(ERROR_CODES.INVALID, `${field} is required`);
  }
  return trimmed;
}

function requireEmail(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.length === 0) {
    raise(ERROR_CODES.INVALID, EMAIL_REQUIRED);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    raise(ERROR_CODES.INVALID, "Enter a valid email");
  }
  return trimmed;
}

const officePerson = v.object({
  _id: v.id("profiles"),
  displayName: v.string(),
  email: v.union(v.string(), v.null()),
  hasLogin: v.boolean(),
});

async function officePersonFields(
  ctx: { db: QueryCtx["db"] },
  profileId: Id<"profiles">
) {
  const profile = await ctx.db.get(profileId);
  if (profile === null) {
    return null;
  }

  const user = await ctx.db.get(profile.userId);
  const loginEmail = await passwordAccountId(ctx, profile.userId);
  const email = loginEmail ?? user?.email ?? null;

  return {
    _id: profile._id,
    displayName: profile.displayName,
    email,
    hasLogin:
      loginEmail !== null ||
      (user?.email !== undefined && user.email.length > 0),
  };
}

export const getHome = staffQuery({
  args: {},
  returns: v.object({
    displayName: v.string(),
    organizationName: v.string(),
  }),
  handler: async (ctx) => {
    if (ctx.viewer.organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const organization = await ctx.db.get(ctx.viewer.organizationId);
    if (organization === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    return {
      displayName: ctx.viewer.profile.displayName,
      organizationName: organization.name,
    };
  },
});

export const listForStaff = staffQuery({
  args: {},
  returns: v.array(officePerson),
  handler: async (ctx) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_organizationId_and_role", (q) =>
        q.eq("organizationId", organizationId).eq("role", "staff")
      )
      .collect();

    const rows = [];
    for (const membership of memberships) {
      const person = await officePersonFields(ctx, membership.profileId);
      if (person !== null) {
        rows.push(person);
      }
    }
    return rows;
  },
});

export const get = staffQuery({
  args: {
    profileId: v.id("profiles"),
  },
  returns: v.union(officePerson, v.null()),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .take(8);
    const staffMembership = memberships.find(
      (row) => row.role === "staff" && row.organizationId === organizationId
    );
    if (staffMembership === undefined) {
      return null;
    }

    return await officePersonFields(ctx, args.profileId);
  },
});

export const update = staffMutation({
  args: {
    profileId: v.id("profiles"),
    displayName: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .take(8);
    const staffMembership = memberships.find(
      (row) => row.role === "staff" && row.organizationId === organizationId
    );
    if (staffMembership === undefined) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const displayName = requireText(args.displayName, "Full name");
    await ctx.db.patch(args.profileId, { displayName });
    return null;
  },
});

export const getForStaffOrg = internalQuery({
  args: {
    organizationId: v.id("organizations"),
    profileId: v.id("profiles"),
  },
  returns: v.union(
    v.object({
      _id: v.id("profiles"),
      hasLogin: v.boolean(),
      loginEmail: v.union(v.string(), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .take(8);
    const staffMembership = memberships.find(
      (row) =>
        row.role === "staff" && row.organizationId === args.organizationId
    );
    if (staffMembership === undefined) {
      return null;
    }

    const profile = await ctx.db.get(args.profileId);
    if (profile === null) {
      return null;
    }

    const loginEmail = await passwordAccountId(ctx, profile.userId);
    return {
      _id: profile._id,
      hasLogin: loginEmail !== null,
      loginEmail,
    };
  },
});

export const attachLogin = internalMutation({
  args: {
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    displayName: v.string(),
  },
  returns: v.id("profiles"),
  handler: async (ctx, args) => {
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (existingProfile !== null) {
      raise(ERROR_CODES.INVALID, EMAIL_TAKEN);
    }

    const displayName = requireText(args.displayName, "Full name");
    const profileId = await ctx.db.insert("profiles", {
      userId: args.userId,
      displayName,
    });

    await ctx.db.insert("memberships", {
      organizationId: args.organizationId,
      profileId,
      role: "staff",
    });

    return profileId;
  },
});

export const create = staffAction({
  args: {
    displayName: v.string(),
    email: v.string(),
    password: v.string(),
  },
  returns: v.id("profiles"),
  handler: async (ctx, args): Promise<Id<"profiles">> => {
    const viewer: {
      userId: Id<"users">;
      profileId: Id<"profiles">;
      organizationId: Id<"organizations">;
    } = await ctx.runQuery(internal.lib.viewer.requireStaffByUserId, {
      userId: ctx.staffUserId,
    });
    const displayName = requireText(args.displayName, "Full name");
    const email = requireEmail(args.email);
    const password = requirePassword(args.password);

    const existingUser = await ctx.runQuery(internal.seed.findUserByEmail, {
      email,
    });
    if (existingUser !== null) {
      raise(ERROR_CODES.INVALID, EMAIL_TAKEN);
    }

    const created = await createAccount(ctx as never, {
      provider: "password",
      account: { id: email, secret: password },
      profile: { email, name: displayName },
    });

    return await ctx.runMutation(internal.staff.attachLogin, {
      organizationId: viewer.organizationId,
      userId: created.user._id,
      displayName,
    });
  },
});

export const setPassword = staffAction({
  args: {
    profileId: v.id("profiles"),
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
    const person = await ctx.runQuery(internal.staff.getForStaffOrg, {
      organizationId: viewer.organizationId,
      profileId: args.profileId,
    });
    if (person === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }
    if (person.loginEmail === null) {
      raise(ERROR_CODES.INVALID, LOGIN_NOT_GRANTED);
    }
    await setAccountPassword(ctx, person.loginEmail, password);
    return null;
  },
});
