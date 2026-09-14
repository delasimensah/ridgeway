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
import { isLeaseCurrent, previousCalendarDate, utcToday } from "./lib/viewer";

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

export const TENANT_SEED = {
  email: "akosua.darko@ridgeway.gh",
  displayName: "Akosua Darko",
  unitLabel: "B12",
  startedOn: "2025-01-01",
} as const;

export const TENANT_RENT_SEED = {
  amount: 450000,
  currency: "GHS" as const,
  dueDay: 5,
  periods: [
    {
      periodLabel: "2026-07",
      dueOn: "2026-07-05",
      confirmedStatus: "paid" as const,
    },
    {
      periodLabel: "2026-08",
      dueOn: "2026-08-05",
      confirmedStatus: "paid" as const,
    },
    {
      periodLabel: "2026-09",
      dueOn: "2026-09-05",
      confirmedStatus: "unpaid" as const,
    },
  ],
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

export const ensureTenantOnBuilding = internalMutation({
  args: {
    userId: v.id("users"),
    displayName: v.string(),
    buildingName: v.string(),
    unitLabel: v.string(),
    startedOn: v.string(),
  },
  returns: v.id("leases"),
  handler: async (ctx, args) => {
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
    if (
      existingProfile !== null &&
      existingProfile.displayName !== args.displayName
    ) {
      await ctx.db.patch(profileId, { displayName: args.displayName });
    }

    const buildings = await ctx.db.query("buildings").collect();
    const building = buildings.find((row) => row.name === args.buildingName);
    if (building === undefined) {
      throw new Error("Building does not exist");
    }

    const units = await ctx.db
      .query("units")
      .withIndex("by_buildingId", (q) => q.eq("buildingId", building._id))
      .collect();
    const existingUnit = units.find((row) => row.label === args.unitLabel);
    const unitId =
      existingUnit?._id ??
      (await ctx.db.insert("units", {
        buildingId: building._id,
        label: args.unitLabel,
        kind: "apartment",
      }));

    const today = utcToday();
    const profileLeases = await ctx.db
      .query("leases")
      .withIndex("by_tenantProfileId", (q) =>
        q.eq("tenantProfileId", profileId)
      )
      .collect();
    const currentForPerson = profileLeases.filter((row) =>
      isLeaseCurrent(row, today)
    );
    if (currentForPerson.length > 0) {
      const onSeedUnit = currentForPerson.find((row) => row.unitId === unitId);
      const kept =
        onSeedUnit ??
        currentForPerson.reduce((oldest, row) =>
          row._creationTime < oldest._creationTime ? row : oldest
        );
      const endedOn = previousCalendarDate(today);
      for (const extra of currentForPerson) {
        if (extra._id !== kept._id) {
          await ctx.db.patch(extra._id, { endedOn });
        }
      }
      if (kept.rentAmount === undefined) {
        await ctx.db.patch(kept._id, {
          rentAmount: TENANT_RENT_SEED.amount,
          rentCurrency: TENANT_RENT_SEED.currency,
          rentDueDay: TENANT_RENT_SEED.dueDay,
        });
      }
      return kept._id;
    }

    const unitLeases = await ctx.db
      .query("leases")
      .withIndex("by_unitId", (q) => q.eq("unitId", unitId))
      .collect();
    const currentOnUnit = unitLeases.find((row) => isLeaseCurrent(row, today));
    if (currentOnUnit !== undefined) {
      if (currentOnUnit.rentAmount === undefined) {
        await ctx.db.patch(currentOnUnit._id, {
          rentAmount: TENANT_RENT_SEED.amount,
          rentCurrency: TENANT_RENT_SEED.currency,
          rentDueDay: TENANT_RENT_SEED.dueDay,
        });
      }
      return currentOnUnit._id;
    }

    return await ctx.db.insert("leases", {
      unitId,
      tenantProfileId: profileId,
      startedOn: args.startedOn,
      rentAmount: TENANT_RENT_SEED.amount,
      rentCurrency: TENANT_RENT_SEED.currency,
      rentDueDay: TENANT_RENT_SEED.dueDay,
    });
  },
});

export const ensureRentPeriods = internalMutation({
  args: {
    leaseId: v.id("leases"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("rentPeriods")
      .withIndex("by_leaseId_and_dueOn", (q) => q.eq("leaseId", args.leaseId))
      .collect();
    const labels = new Set(existing.map((row) => row.periodLabel));

    for (const period of TENANT_RENT_SEED.periods) {
      if (labels.has(period.periodLabel)) {
        continue;
      }
      await ctx.db.insert("rentPeriods", {
        leaseId: args.leaseId,
        periodLabel: period.periodLabel,
        amount: TENANT_RENT_SEED.amount,
        currency: TENANT_RENT_SEED.currency,
        dueOn: period.dueOn,
        confirmedStatus: period.confirmedStatus,
      });
    }
    return null;
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
    tenantPassword: v.string(),
  },
  returns: v.object({
    staffEmail: v.string(),
    fieldEmail: v.string(),
    ownerAEmail: v.string(),
    ownerBEmail: v.string(),
    tenantEmail: v.string(),
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
    const tenantUserId = await ensureAccount(
      ctx,
      TENANT_SEED.email,
      args.tenantPassword,
      TENANT_SEED.displayName
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

    const leaseId = await ctx.runMutation(
      internal.seed.ensureTenantOnBuilding,
      {
        userId: tenantUserId,
        displayName: TENANT_SEED.displayName,
        buildingName: OWNER_A_SEED.buildingName,
        unitLabel: TENANT_SEED.unitLabel,
        startedOn: TENANT_SEED.startedOn,
      }
    );
    await ctx.runMutation(internal.seed.ensureRentPeriods, { leaseId });

    return {
      staffEmail: STAFF_SEED.email,
      fieldEmail: FIELD_SEED.email,
      ownerAEmail: OWNER_A_SEED.email,
      ownerBEmail: OWNER_B_SEED.email,
      tenantEmail: TENANT_SEED.email,
    };
  },
});
