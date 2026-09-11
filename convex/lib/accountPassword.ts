import { modifyAccountCredentials } from "@convex-dev/auth/server";

import type { Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { ERROR_CODES, raise } from "./errors";

export const MIN_PASSWORD_LENGTH = 8;
export const PASSWORD_TOO_SHORT = "Password must be at least 8 characters long";

export function requirePassword(value: string): string {
  if (value.length < MIN_PASSWORD_LENGTH) {
    raise(ERROR_CODES.INVALID, PASSWORD_TOO_SHORT);
  }
  return value;
}

export async function passwordAccountId(
  ctx: { db: QueryCtx["db"] },
  userId: Id<"users">
): Promise<string | null> {
  const account = await ctx.db
    .query("authAccounts")
    .withIndex("userIdAndProvider", (q) =>
      q.eq("userId", userId).eq("provider", "password")
    )
    .unique();
  return account === null ? null : account.providerAccountId;
}

export async function setAccountPassword(
  ctx: unknown,
  email: string,
  password: string
): Promise<void> {
  await modifyAccountCredentials(ctx as never, {
    provider: "password",
    account: { id: email, secret: password },
  });
}
