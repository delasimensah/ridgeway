import { describe, expect, it } from "vitest";

import { api, internal } from "./_generated/api";
import {
  FIELD_SEED,
  ORGANIZATION_NAME,
  OWNER_A_SEED,
  STAFF_SEED,
  TENANT_SEED,
} from "./seed";
import { asUser, errorCode, makeBackend } from "./test.setup";

describe("seed.attachIdentity", () => {
  it("is idempotent and grants staff membership", async () => {
    const t = makeBackend();
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: STAFF_SEED.email,
        name: STAFF_SEED.displayName,
      });
    });

    const first = await t.mutation(internal.seed.attachIdentity, {
      userId,
      displayName: STAFF_SEED.displayName,
      role: "staff",
      organizationName: ORGANIZATION_NAME,
    });
    const second = await t.mutation(internal.seed.attachIdentity, {
      userId,
      displayName: STAFF_SEED.displayName,
      role: "staff",
      organizationName: ORGANIZATION_NAME,
    });

    expect(second.profileId).toBe(first.profileId);
    expect(second.organizationId).toBe(first.organizationId);

    const viewer = await asUser(t, userId).query(api.profiles.getCurrent, {});
    expect(viewer.isStaff).toBe(true);
  });

  it("lets owner A list only the building attached to owner A", async () => {
    const t = makeBackend();
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: OWNER_A_SEED.email,
        name: OWNER_A_SEED.displayName,
      });
    });
    const ownerId = await t.mutation(internal.seed.ensureOwner, {
      displayName: OWNER_A_SEED.displayName,
      contactEmail: OWNER_A_SEED.email,
      organizationName: ORGANIZATION_NAME,
    });
    await t.mutation(internal.seed.attachIdentity, {
      userId,
      displayName: OWNER_A_SEED.displayName,
      role: "owner",
      organizationName: ORGANIZATION_NAME,
      ownerId,
    });
    await t.mutation(internal.seed.ensureBuildingForOwner, {
      ownerId,
      name: OWNER_A_SEED.buildingName,
      street: OWNER_A_SEED.street,
      area: OWNER_A_SEED.area,
    });

    const list = await asUser(t, userId).query(api.buildings.listForViewer, {});
    expect(list.map((row) => row.name)).toEqual([OWNER_A_SEED.buildingName]);
  });

  it("puts Akosua on Ridge Court B12 with a current lease", async () => {
    const t = makeBackend();
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: TENANT_SEED.email,
        name: TENANT_SEED.displayName,
      });
    });
    const ownerId = await t.mutation(internal.seed.ensureOwner, {
      displayName: OWNER_A_SEED.displayName,
      contactEmail: OWNER_A_SEED.email,
      organizationName: ORGANIZATION_NAME,
    });
    await t.mutation(internal.seed.ensureBuildingForOwner, {
      ownerId,
      name: OWNER_A_SEED.buildingName,
      street: OWNER_A_SEED.street,
      area: OWNER_A_SEED.area,
    });
    await t.mutation(internal.seed.ensureTenantOnBuilding, {
      userId,
      displayName: TENANT_SEED.displayName,
      buildingName: OWNER_A_SEED.buildingName,
      unitLabel: TENANT_SEED.unitLabel,
      startedOn: TENANT_SEED.startedOn,
    });

    const viewer = await asUser(t, userId).query(api.profiles.getCurrent, {});
    expect(viewer.currentLease).toMatchObject({
      unitLabel: TENANT_SEED.unitLabel,
      buildingName: OWNER_A_SEED.buildingName,
    });
  });

  it("does not give a field worker the staff home", async () => {
    const t = makeBackend();
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: FIELD_SEED.email,
        name: FIELD_SEED.displayName,
      });
    });
    await t.mutation(internal.seed.attachIdentity, {
      userId,
      displayName: FIELD_SEED.displayName,
      role: "field",
      organizationName: ORGANIZATION_NAME,
    });

    try {
      await asUser(t, userId).query(api.staff.getHome, {});
      throw new Error("expected getHome to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });
});
