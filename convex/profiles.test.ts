import { ConvexError } from "convex/values";
import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { asUser, insertPerson, makeBackend } from "./test.setup";

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

describe("profiles", () => {
  it("returns the signed-in staff viewer", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });

    const viewer = await asUser(t, userId).query(api.profiles.getCurrent, {});

    expect(viewer).toMatchObject({
      displayName: "Ama Boateng",
      isStaff: true,
      isField: false,
    });
  });

  it("refuses getCurrent when nobody is signed in", async () => {
    const t = makeBackend();

    try {
      await t.query(api.profiles.getCurrent, {});
      throw new Error("expected getCurrent to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("UNAUTHENTICATED");
    }
  });

  it("creates a profile for a login that does not have one yet", async () => {
    const t = makeBackend();
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "new.person@ridgeway.gh",
        name: "New Person",
      });
    });

    const profileId = await asUser(t, userId).mutation(
      api.profiles.ensureForCurrentUser,
      {}
    );
    const again = await asUser(t, userId).mutation(
      api.profiles.ensureForCurrentUser,
      {}
    );

    expect(again).toBe(profileId);
    const viewer = await asUser(t, userId).query(api.profiles.getCurrent, {});
    expect(viewer.isStaff).toBe(false);
    expect(viewer.displayName).toBe("new.person");
  });
});
