import { describe, expect, it } from "vitest";

import { api, internal } from "./_generated/api";
import {
  FIELD_PEOPLE,
  OWNER_ASANTE,
  OWNER_LAMPTEY,
  SEED_RENT_END,
  SEED_RENT_START,
  STAFF_AMA,
  TENANT_ABA,
  TENANT_KOFI,
} from "./seedWorld";
import { asUser, errorCode, makeBackend } from "./test.setup";

async function userIdByEmail(t: ReturnType<typeof makeBackend>, email: string) {
  return await t.run(async (ctx) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();
    if (user === null) {
      throw new Error(`missing user ${email}`);
    }
    return user._id;
  });
}

describe("seed.insertWorld", () => {
  it("creates a two-year Accra portfolio with mixed occupancy and USD on Asante", async () => {
    const t = makeBackend();
    await t.mutation(internal.seed.insertWorld, {});

    const staffId = await userIdByEmail(t, STAFF_AMA.email);
    const buildings = await asUser(t, staffId).query(
      api.buildings.listForViewer,
      {}
    );
    expect(buildings).toHaveLength(10);
    expect(buildings.every((row) => row.unitCount >= 3)).toBe(true);
    expect(
      buildings.some(
        (row) => row.name === "Ridge Court" && row.emptyUnitCount > 0
      )
    ).toBe(true);

    const names = await t.run(async (ctx) => {
      const profiles = await ctx.db.query("profiles").collect();
      return profiles.map((row) => row.displayName.toLowerCase());
    });
    expect(names.some((name) => name.includes("test user"))).toBe(false);

    const ridge = buildings.find((row) => row.name === "Ridge Court");
    if (ridge === undefined) {
      throw new Error("Ridge Court missing");
    }
    const units = await asUser(t, staffId).query(api.units.listByBuilding, {
      buildingId: ridge._id,
    });
    const vacantA4 = units.find((row) => row.label === "A4");
    expect(vacantA4?.tenantName).toBeNull();
    const b12 = units.find((row) => row.label === "B12");
    expect(b12?.tenantName).toBe(TENANT_ABA.displayName);
    expect(b12?.rentCurrency).toBe("GHS");

    const tickets = await asUser(t, staffId).query(
      api.workOrders.listForBuilding,
      {
        buildingId: ridge._id,
      }
    );
    const openOnB12 = tickets.filter(
      (row) => row.unitLabel === "B12" && row.status !== "done"
    );
    expect(openOnB12.length).toBeGreaterThan(1);

    const abaId = await userIdByEmail(t, TENANT_ABA.email);
    const rent = await asUser(t, abaId).query(
      api.rent.listForCurrentTenant,
      {}
    );
    const labels = rent.periods.map((row) => row.periodLabel).sort();
    expect(labels[0]).toBe(SEED_RENT_START);
    expect(labels[labels.length - 1]).toBe(SEED_RENT_END);
    expect(labels).toHaveLength(24);

    const asanteId = await userIdByEmail(t, OWNER_ASANTE.email);
    const asanteBuildings = await asUser(t, asanteId).query(
      api.buildings.listForViewer,
      {}
    );
    const airport = asanteBuildings.find(
      (row) => row.name === "Airport West Residences"
    );
    if (airport === undefined) {
      throw new Error("Airport West Residences missing");
    }
    const asanteRent = await asUser(t, asanteId).query(
      api.rent.listByBuilding,
      {
        buildingId: airport._id,
        periodLabel: "2026-09",
        paginationOpts: { numItems: 20, cursor: null },
      }
    );
    expect(asanteRent.currency).toBe("USD");
    expect(asanteRent.collected + asanteRent.outstanding).toBeGreaterThan(0);
  });

  it("keeps Lamptey from seeing Asante buildings", async () => {
    const t = makeBackend();
    await t.mutation(internal.seed.insertWorld, {});

    const lampteyId = await userIdByEmail(t, OWNER_LAMPTEY.email);
    const list = await asUser(t, lampteyId).query(
      api.buildings.listForViewer,
      {}
    );
    expect(list.every((row) => row.name !== "Airport West Residences")).toBe(
      true
    );
    expect(list.some((row) => row.name === "Ridge Court")).toBe(true);
  });

  it("leaves an ended tenant without a current unit", async () => {
    const t = makeBackend();
    await t.mutation(internal.seed.insertWorld, {});

    const kofiId = await userIdByEmail(t, TENANT_KOFI.email);
    const viewer = await asUser(t, kofiId).query(api.profiles.getCurrent, {});
    expect(viewer.currentLease).toBeNull();
    expect(viewer.endedLease).toMatchObject({
      unitLabel: "A4",
      buildingName: "Ridge Court",
    });
  });

  it("does not give a field worker the staff home", async () => {
    const t = makeBackend();
    await t.mutation(internal.seed.insertWorld, {});

    const fieldId = await userIdByEmail(t, FIELD_PEOPLE[0].email);
    try {
      await asUser(t, fieldId).query(api.staff.getHome, {});
      throw new Error("expected getHome to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("wipeChunk clears the seeded world", async () => {
    const t = makeBackend();
    await t.mutation(internal.seed.insertWorld, {});
    for (let step = 0; step < 400; step += 1) {
      const deleted = await t.mutation(internal.seed.wipeChunk, {});
      if (deleted === 0) {
        break;
      }
    }
    const leftover = await t.run(async (ctx) => {
      const buildings = await ctx.db.query("buildings").collect();
      const users = await ctx.db.query("users").collect();
      return { buildings: buildings.length, users: users.length };
    });
    expect(leftover).toEqual({ buildings: 0, users: 0 });
  });
});
