import { ConvexError } from "convex/values";
import { afterEach, describe, expect, it } from "vitest";

import { api } from "../_generated/api";
import { asUser, insertPerson, makeBackend } from "../test.setup";
import { DEMO_LOCK_MESSAGE } from "./functions";

function errorMessage(error: unknown): string | undefined {
  if (
    error instanceof ConvexError &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data
  ) {
    return String((error.data as { message: unknown }).message);
  }
  return undefined;
}

async function expectDemoRefusal(run: () => Promise<unknown>) {
  try {
    await run();
  } catch (error) {
    expect(errorMessage(error)).toBe(DEMO_LOCK_MESSAGE);
    return;
  }
  throw new Error("expected the demo lock to refuse");
}

describe("demo lock", () => {
  afterEach(() => {
    delete process.env.RIDGEWAY_DEMO_LOCK;
  });

  it("refuses staff, owner, and tenant saves while the lock is on, and allows a save when it is off", async () => {
    process.env.RIDGEWAY_DEMO_LOCK = "on";
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    if (staff.organizationId === undefined) {
      throw new Error("staff organization missing");
    }
    const organizationId = staff.organizationId;
    const tenant = await insertPerson(t, {
      email: "aba.gyamfi@ridgeway.gh",
      displayName: "Aba Gyamfi",
      role: null,
      organizationId,
    });
    const unitId = await t.run(async (ctx) => {
      const buildingId = await ctx.db.insert("buildings", {
        organizationId,
        name: "Ridge Court",
        address: "14 Ridge Road, Cantonments",
      });
      return await ctx.db.insert("units", {
        buildingId,
        label: "B12",
        kind: "apartment",
      });
    });

    await expectDemoRefusal(() =>
      asUser(t, staff.userId).mutation(api.buildings.create, {
        name: "New Court",
        street: "1 High Street",
        area: "Osu",
      })
    );
    await expectDemoRefusal(() =>
      asUser(t, tenant.userId).mutation(api.workOrders.createByTenant, {
        unitId,
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      })
    );
    await expectDemoRefusal(() =>
      asUser(t, staff.userId).action(api.staff.setPassword, {
        profileId: staff.profileId,
        password: "a-new-password",
      })
    );

    const buildings = await asUser(t, staff.userId).query(
      api.buildings.listForViewer,
      {}
    );
    expect(buildings).toHaveLength(1);

    delete process.env.RIDGEWAY_DEMO_LOCK;
    const createdId = await asUser(t, staff.userId).mutation(
      api.buildings.create,
      {
        name: "New Court",
        street: "1 High Street",
        area: "Osu",
      }
    );
    expect(createdId).toBeTruthy();
  });
});
