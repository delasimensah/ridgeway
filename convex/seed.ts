import { createAccount } from "@convex-dev/auth/server";
import type { GenericActionCtx } from "convex/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import type { DataModel, Id } from "./_generated/dataModel";
import {
  internalAction,
  internalMutation,
  internalQuery,
  type MutationCtx,
} from "./_generated/server";
import { formatAccraAddress } from "./buildings";
import { dueOnForPeriod } from "./rent";
import {
  BUILDINGS,
  FIELD_PEOPLE,
  ORGANIZATION_NAME,
  OWNER_PEOPLE,
  STAFF_PEOPLE,
  TICKETS,
  loginEmails,
  ownerCurrency,
  rentRowsForLease,
  toSmallestUnit,
  type SeedTenant,
} from "./seedWorld";

const WIPE_TAKE = 64;

const PRODUCT_TABLES = [
  "files",
  "workOrderEvents",
  "workOrders",
  "rentPeriods",
  "leases",
  "units",
  "buildings",
  "memberships",
  "owners",
  "profiles",
  "organizations",
] as const;

const AUTH_TABLES = [
  "authVerificationCodes",
  "authRefreshTokens",
  "authSessions",
  "authAccounts",
  "authVerifiers",
  "authRateLimits",
  "users",
] as const;

async function deleteTaken(
  ctx: MutationCtx,
  table: (typeof PRODUCT_TABLES)[number] | (typeof AUTH_TABLES)[number]
): Promise<number> {
  const rows = await ctx.db.query(table).take(WIPE_TAKE);
  for (const row of rows) {
    if (table === "files" && "storageId" in row) {
      await ctx.storage.delete(row.storageId);
    }
    await ctx.db.delete(row._id);
  }
  return rows.length;
}

export const wipeChunk = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    let deleted = 0;
    for (const table of PRODUCT_TABLES) {
      deleted += await deleteTaken(ctx, table);
      if (deleted > 0) {
        return deleted;
      }
    }
    for (const table of AUTH_TABLES) {
      deleted += await deleteTaken(ctx, table);
      if (deleted > 0) {
        return deleted;
      }
    }
    const stored = await ctx.db.system.query("_storage").take(WIPE_TAKE);
    for (const file of stored) {
      await ctx.storage.delete(file._id);
      deleted += 1;
    }
    return deleted;
  },
});

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

async function userIdByEmail(
  ctx: MutationCtx,
  email: string
): Promise<Id<"users"> | null> {
  const user = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .unique();
  return user?._id ?? null;
}

async function ensureUser(
  ctx: MutationCtx,
  email: string,
  displayName: string
): Promise<Id<"users">> {
  const existing = await userIdByEmail(ctx, email);
  if (existing !== null) {
    await ctx.db.patch(existing, { name: displayName, email });
    return existing;
  }
  return await ctx.db.insert("users", { email, name: displayName });
}

async function ensureProfile(
  ctx: MutationCtx,
  userId: Id<"users">,
  displayName: string,
  phone: string | undefined
): Promise<Id<"profiles">> {
  const existing = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
  const fields = {
    displayName,
    ...(phone !== undefined ? { phone } : {}),
  };
  if (existing !== null) {
    await ctx.db.patch(existing._id, fields);
    return existing._id;
  }
  return await ctx.db.insert("profiles", { userId, ...fields });
}

function titleFromDescription(description: string): string {
  const firstLine = description.split("\n")[0]?.trim() ?? "";
  if (firstLine.length <= 80) {
    return firstLine;
  }
  return `${firstLine.slice(0, 77).trimEnd()}...`;
}

async function insertLeaseAndRent(
  ctx: MutationCtx,
  unitId: Id<"units">,
  tenant: SeedTenant,
  currency: "GHS" | "USD"
): Promise<Id<"leases">> {
  const userId = await ensureUser(ctx, tenant.email, tenant.displayName);
  const profileId = await ensureProfile(
    ctx,
    userId,
    tenant.displayName,
    tenant.phone
  );
  const leaseId = await ctx.db.insert("leases", {
    unitId,
    tenantProfileId: profileId,
    startedOn: tenant.startedOn,
    ...(tenant.endedOn !== undefined ? { endedOn: tenant.endedOn } : {}),
    rentAmount: toSmallestUnit(tenant.rentMajor),
    rentCurrency: currency,
    rentDueDay: tenant.dueDay,
  });
  const now = Date.now();
  for (const row of rentRowsForLease(tenant)) {
    await ctx.db.insert("rentPeriods", {
      leaseId,
      periodLabel: row.periodLabel,
      amount: toSmallestUnit(tenant.rentMajor),
      currency,
      dueOn: dueOnForPeriod(row.periodLabel, tenant.dueDay),
      confirmedStatus: row.confirmedStatus,
      ...(row.confirmedAmount !== undefined
        ? { confirmedAmount: row.confirmedAmount }
        : {}),
      ...(row.tenantReported === true ? { tenantReportedAt: now } : {}),
    });
  }
  return leaseId;
}

export const insertWorld = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const organizationId = await ctx.db.insert("organizations", {
      name: ORGANIZATION_NAME,
    });

    const staffProfileIds: Id<"profiles">[] = [];
    for (const person of STAFF_PEOPLE) {
      const userId = await ensureUser(ctx, person.email, person.displayName);
      const profileId = await ensureProfile(
        ctx,
        userId,
        person.displayName,
        person.phone
      );
      await ctx.db.insert("memberships", {
        organizationId,
        profileId,
        role: "staff",
      });
      staffProfileIds.push(profileId);
    }

    const fieldByEmail = new Map<string, Id<"profiles">>();
    for (const person of FIELD_PEOPLE) {
      const userId = await ensureUser(ctx, person.email, person.displayName);
      const profileId = await ensureProfile(
        ctx,
        userId,
        person.displayName,
        person.phone
      );
      await ctx.db.insert("memberships", {
        organizationId,
        profileId,
        role: "field",
      });
      fieldByEmail.set(person.email, profileId);
    }

    const ownerByEmail = new Map<string, Id<"owners">>();
    for (const person of OWNER_PEOPLE) {
      const ownerId = await ctx.db.insert("owners", {
        organizationId,
        displayName: person.displayName,
        contactEmail: person.email,
        contactPhone: person.phone,
      });
      const userId = await ensureUser(ctx, person.email, person.displayName);
      const profileId = await ensureProfile(
        ctx,
        userId,
        person.displayName,
        person.phone
      );
      await ctx.db.insert("memberships", {
        organizationId,
        profileId,
        role: "owner",
        ownerId,
      });
      ownerByEmail.set(person.email, ownerId);
    }

    const staffActor = staffProfileIds[0];
    if (staffActor === undefined) {
      throw new Error("Seed needs a staff person");
    }

    const unitByKey = new Map<
      string,
      {
        unitId: Id<"units">;
        buildingId: Id<"buildings">;
        leaseId: Id<"leases"> | null;
      }
    >();

    for (const building of BUILDINGS) {
      const ownerId = ownerByEmail.get(building.ownerEmail);
      if (ownerId === undefined) {
        throw new Error(`Seed owner missing for ${building.name}`);
      }
      const currency = ownerCurrency(building.ownerEmail);
      const buildingId = await ctx.db.insert("buildings", {
        organizationId,
        ownerId,
        name: building.name,
        address: formatAccraAddress(building.street, building.area),
        houseRules: building.houseRules,
      });
      for (const unit of building.units) {
        const unitId = await ctx.db.insert("units", {
          buildingId,
          label: unit.label,
          kind: unit.kind,
        });
        let currentLeaseId: Id<"leases"> | null = null;
        let latestLeaseId: Id<"leases"> | null = null;
        for (const lease of unit.leases) {
          const leaseId = await insertLeaseAndRent(
            ctx,
            unitId,
            lease,
            currency
          );
          latestLeaseId = leaseId;
          if (lease.endedOn === undefined) {
            currentLeaseId = leaseId;
          }
        }
        unitByKey.set(`${building.name}::${unit.label}`, {
          unitId,
          buildingId,
          leaseId: currentLeaseId ?? latestLeaseId,
        });
      }
    }

    for (const ticket of TICKETS) {
      const placed = unitByKey.get(
        `${ticket.buildingName}::${ticket.unitLabel}`
      );
      if (placed === undefined) {
        throw new Error(
          `Seed ticket unit missing: ${ticket.buildingName} ${ticket.unitLabel}`
        );
      }
      const assigneeProfileId =
        ticket.assigneeEmail === undefined
          ? undefined
          : fieldByEmail.get(ticket.assigneeEmail);
      if (
        ticket.assigneeEmail !== undefined &&
        assigneeProfileId === undefined
      ) {
        throw new Error(`Seed field worker missing: ${ticket.assigneeEmail}`);
      }

      const tenantActor =
        placed.leaseId === null
          ? staffActor
          : ((await ctx.db.get(placed.leaseId))?.tenantProfileId ?? staffActor);

      const workOrderId = await ctx.db.insert("workOrders", {
        organizationId,
        buildingId: placed.buildingId,
        unitId: placed.unitId,
        ...(placed.leaseId !== null ? { leaseId: placed.leaseId } : {}),
        status: ticket.status,
        title: titleFromDescription(ticket.description),
        description: ticket.description,
        category: ticket.category,
        urgency: ticket.urgency,
        createdByProfileId: tenantActor,
        ...(assigneeProfileId !== undefined ? { assigneeProfileId } : {}),
        ...(ticket.scheduledFor !== undefined
          ? { scheduledFor: ticket.scheduledFor }
          : {}),
      });

      await ctx.db.insert("workOrderEvents", {
        workOrderId,
        actorProfileId: tenantActor,
        toStatus: "received",
      });
      if (ticket.status === "received") {
        continue;
      }
      await ctx.db.insert("workOrderEvents", {
        workOrderId,
        actorProfileId: staffActor,
        fromStatus: "received",
        toStatus: "assigned",
      });
      if (ticket.status === "assigned") {
        continue;
      }
      await ctx.db.insert("workOrderEvents", {
        workOrderId,
        actorProfileId: assigneeProfileId ?? staffActor,
        fromStatus: "assigned",
        toStatus: "scheduled",
      });
      if (ticket.status === "scheduled") {
        continue;
      }
      await ctx.db.insert("workOrderEvents", {
        workOrderId,
        actorProfileId: assigneeProfileId ?? staffActor,
        fromStatus: "scheduled",
        toStatus: "done",
        ...(ticket.note !== undefined ? { note: ticket.note } : {}),
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
  const created = await createAccount(ctx as never, {
    provider: "password",
    account: { id: email, secret: password },
    profile: { email, name: displayName },
  });
  return created.user._id;
}

async function wipeAll(ctx: GenericActionCtx<DataModel>) {
  for (;;) {
    const deleted = await ctx.runMutation(internal.seed.wipeChunk, {});
    if (deleted === 0) {
      return;
    }
  }
}

export const run = internalAction({
  args: {
    staffPassword: v.string(),
    fieldPassword: v.string(),
    ownerPassword: v.string(),
    tenantPassword: v.string(),
  },
  returns: v.object({
    staffEmails: v.array(v.string()),
    fieldEmails: v.array(v.string()),
    ownerEmails: v.array(v.string()),
    tenantEmails: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    await wipeAll(ctx);

    const logins = loginEmails();
    const names = new Map<string, string>();
    for (const person of STAFF_PEOPLE) {
      names.set(person.email, person.displayName);
    }
    for (const person of FIELD_PEOPLE) {
      names.set(person.email, person.displayName);
    }
    for (const person of OWNER_PEOPLE) {
      names.set(person.email, person.displayName);
    }
    for (const building of BUILDINGS) {
      for (const unit of building.units) {
        for (const lease of unit.leases) {
          names.set(lease.email, lease.displayName);
        }
      }
    }

    for (const email of logins.staff) {
      await ensureAccount(
        ctx,
        email,
        args.staffPassword,
        names.get(email) ?? email
      );
    }
    for (const email of logins.field) {
      await ensureAccount(
        ctx,
        email,
        args.fieldPassword,
        names.get(email) ?? email
      );
    }
    for (const email of logins.owners) {
      await ensureAccount(
        ctx,
        email,
        args.ownerPassword,
        names.get(email) ?? email
      );
    }
    for (const email of logins.tenants) {
      await ensureAccount(
        ctx,
        email,
        args.tenantPassword,
        names.get(email) ?? email
      );
    }

    await ctx.runMutation(internal.seed.insertWorld, {});
    return {
      staffEmails: logins.staff,
      fieldEmails: logins.field,
      ownerEmails: logins.owners,
      tenantEmails: logins.tenants,
    };
  },
});
