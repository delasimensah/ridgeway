import { ConvexError } from "convex/values";
import { describe, expect, it } from "vitest";

import { api, internal } from "./_generated/api";
import { asUser, makeBackend } from "./test.setup";
import { FIELD_SEED, ORGANIZATION_NAME, STAFF_SEED } from "./seed";

function errorCode(error: unknown): string | undefined {
  if (
    error instanceof ConvexError &&
    typeof error.data === "object" &&
    error.data !== null &&
    "code" in error.data
  ) {
    return String((error.data as { code: string }).code);
  }
  return undefined;
}

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
