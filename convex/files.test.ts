import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { asUser, errorCode, insertPerson, makeBackend } from "./test.setup";

async function tenantUserIdByEmail(
  t: ReturnType<typeof makeBackend>,
  email: string
) {
  return await t.run(async (ctx) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();
    if (user === null) {
      throw new Error("tenant user missing");
    }
    return user._id;
  });
}

async function seedTicket(t: ReturnType<typeof makeBackend>) {
  const staff = await insertPerson(t, {
    email: "ama.boateng@ridgeway.gh",
    displayName: "Ama Boateng",
    role: "staff",
  });
  const buildingId = await asUser(t, staff.userId).mutation(
    api.buildings.create,
    {
      name: "Ridge Court",
      street: "14 Ridge Road",
      area: "Cantonments",
    }
  );
  const unitId = await asUser(t, staff.userId).mutation(api.units.create, {
    buildingId,
    label: "B12",
    kind: "apartment",
    newTenant: {
      displayName: "Akosua Darko",
      email: "akosua.darko@ridgeway.gh",
      startedOn: "2025-01-01",
    },
  });
  const tenantUserId = await tenantUserIdByEmail(t, "akosua.darko@ridgeway.gh");
  const workOrderId = await asUser(t, tenantUserId).mutation(
    api.workOrders.createByTenant,
    {
      unitId,
      description: "Kitchen tap leak",
      category: "plumbing",
      urgency: "normal",
    }
  );
  return { staff, tenantUserId, workOrderId };
}

describe("files", () => {
  it("lets the tenant attach a repair photo and see it after reload", async () => {
    const t = makeBackend();
    const { tenantUserId, workOrderId } = await seedTicket(t);
    const uploadUrl = await asUser(t, tenantUserId).mutation(
      api.files.createUploadUrl,
      { workOrderId }
    );
    expect(uploadUrl.length).toBeGreaterThan(0);

    const storageId = await t.run(async (ctx) => {
      return await ctx.storage.store(new Blob(["tap-photo"]));
    });
    await asUser(t, tenantUserId).mutation(api.files.attachToWorkOrder, {
      workOrderId,
      storageId,
      kind: "repair",
    });

    const ticket = await asUser(t, tenantUserId).query(api.workOrders.get, {
      workOrderId,
    });
    expect(ticket?.photoUrls.length).toBe(1);
  });

  it("refuses a completion photo and a caller who cannot write", async () => {
    const t = makeBackend();
    const { staff, tenantUserId, workOrderId } = await seedTicket(t);
    const storageId = await t.run(async (ctx) => {
      return await ctx.storage.store(new Blob(["tap-photo"]));
    });

    try {
      await asUser(t, tenantUserId).mutation(api.files.attachToWorkOrder, {
        workOrderId,
        storageId,
        kind: "completion",
      });
      throw new Error("expected completion attach to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    const otherOrganizationId = await t.run(async (ctx) => {
      return await ctx.db.insert("organizations", {
        name: "Harbour Management",
      });
    });
    const otherStaff = await insertPerson(t, {
      email: "other.staff@harbour.gh",
      displayName: "Other Staff",
      role: "staff",
      organizationId: otherOrganizationId,
    });

    try {
      await asUser(t, otherStaff.userId).mutation(api.files.attachToWorkOrder, {
        workOrderId,
        storageId,
        kind: "repair",
      });
      throw new Error("expected other org attach to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    await asUser(t, staff.userId).mutation(api.files.attachToWorkOrder, {
      workOrderId,
      storageId,
      kind: "repair",
    });
  });
});
