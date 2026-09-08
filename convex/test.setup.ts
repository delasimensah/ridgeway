/// <reference types="vite/client" />

import { convexTest } from "convex-test";
import { ConvexError } from "convex/values";

import type { Id } from "./_generated/dataModel";
import schema from "./schema";

export const modules = import.meta.glob([
  "./**/*.ts",
  "./_generated/**/*.js",
  "!./**/*.test.ts",
  "!./test.setup.ts",
]);

export function makeBackend() {
  return convexTest(schema, modules);
}

export function errorCode(error: unknown): string | undefined {
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

export async function insertPerson(
  t: ReturnType<typeof makeBackend>,
  args: {
    email: string;
    displayName: string;
    role: "staff" | "field" | null;
    organizationId?: Id<"organizations">;
  }
) {
  return await t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.displayName,
    });
    const existingOrg = (await ctx.db.query("organizations").take(1))[0];
    const organizationId =
      args.organizationId ??
      existingOrg?._id ??
      (await ctx.db.insert("organizations", {
        name: "Ridgeway Property Group",
      }));
    const profileId = await ctx.db.insert("profiles", {
      userId,
      displayName: args.displayName,
    });
    if (args.role !== null) {
      await ctx.db.insert("memberships", {
        organizationId,
        profileId,
        role: args.role,
      });
    }
    return { userId, profileId, organizationId };
  });
}

export function asUser(t: ReturnType<typeof makeBackend>, userId: Id<"users">) {
  return t.withIdentity({ subject: userId });
}
