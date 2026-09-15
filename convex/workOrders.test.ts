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

async function seedCurrentTenant(t: ReturnType<typeof makeBackend>) {
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
  return { staff, buildingId, unitId, tenantUserId };
}

describe("workOrders", () => {
  it("lets a tenant on a current lease file a repair at received", async () => {
    const t = makeBackend();
    const { staff, buildingId, unitId, tenantUserId } =
      await seedCurrentTenant(t);

    const workOrderId = await asUser(t, tenantUserId).mutation(
      api.workOrders.createByTenant,
      {
        unitId,
        description: "Kitchen tap leak\nIt drips all night.",
        category: "plumbing",
        urgency: "normal",
      }
    );

    const ticket = await asUser(t, tenantUserId).query(api.workOrders.get, {
      workOrderId,
    });
    expect(ticket?.status).toBe("received");
    expect(ticket?.title).toBe("Kitchen tap leak");
    expect(ticket?.description).toBe("Kitchen tap leak\nIt drips all night.");
    expect(ticket?.canEditDescription).toBe(true);
    expect(ticket?.events.map((event) => event.toStatus)).toEqual(["received"]);

    const again = await asUser(t, tenantUserId).query(api.workOrders.get, {
      workOrderId,
    });
    expect(again?.status).toBe("received");

    const staffList = await asUser(t, staff.userId).query(
      api.workOrders.listForBuilding,
      { buildingId }
    );
    expect(staffList).toEqual([
      expect.objectContaining({
        _id: workOrderId,
        title: "Kitchen tap leak",
        status: "received",
        unitLabel: "B12",
        buildingName: "Ridge Court",
      }),
    ]);

    const orgList = await asUser(t, staff.userId).query(
      api.workOrders.listForStaff,
      {}
    );
    expect(orgList.map((row) => row._id)).toEqual([workOrderId]);

    const tenantList = await asUser(t, tenantUserId).query(
      api.workOrders.listForCurrentTenant,
      {}
    );
    expect(tenantList).toEqual([
      expect.objectContaining({
        _id: workOrderId,
        title: "Kitchen tap leak",
        status: "received",
        category: "plumbing",
        urgency: "normal",
      }),
    ]);

    const buildings = await asUser(t, staff.userId).query(
      api.buildings.listForViewer,
      {}
    );
    expect(
      buildings.find((row) => row._id === buildingId)?.openRepairCount
    ).toBe(1);
  });

  it("refuses create when the lease has ended", async () => {
    const t = makeBackend();
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
        startedOn: "2024-01-01",
        endedOn: "2025-01-01",
      },
    });
    const tenantUserId = await tenantUserIdByEmail(
      t,
      "akosua.darko@ridgeway.gh"
    );

    try {
      await asUser(t, tenantUserId).mutation(api.workOrders.createByTenant, {
        unitId,
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      });
      throw new Error("expected createByTenant to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("refuses create for staff and for an owner", async () => {
    const t = makeBackend();
    const { staff, unitId } = await seedCurrentTenant(t);
    const owner = await insertPerson(t, {
      email: "kwesi.mensah@ridgeway.gh",
      displayName: "Kwesi Mensah",
      role: "owner",
    });

    try {
      await asUser(t, staff.userId).mutation(api.workOrders.createByTenant, {
        unitId,
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      });
      throw new Error("expected staff create to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    try {
      await asUser(t, owner.userId).mutation(api.workOrders.createByTenant, {
        unitId,
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      });
      throw new Error("expected owner create to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("lets the tenant correct the description only while received", async () => {
    const t = makeBackend();
    const { tenantUserId, unitId } = await seedCurrentTenant(t);
    const workOrderId = await asUser(t, tenantUserId).mutation(
      api.workOrders.createByTenant,
      {
        unitId,
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      }
    );

    await asUser(t, tenantUserId).mutation(api.workOrders.updateDescription, {
      workOrderId,
      description: "Bathroom tap leak",
    });
    const updated = await asUser(t, tenantUserId).query(api.workOrders.get, {
      workOrderId,
    });
    expect(updated?.title).toBe("Bathroom tap leak");
    expect(updated?.description).toBe("Bathroom tap leak");

    await t.run(async (ctx) => {
      await ctx.db.patch(workOrderId, { status: "assigned" });
    });

    try {
      await asUser(t, tenantUserId).mutation(api.workOrders.updateDescription, {
        workOrderId,
        description: "Still leaking",
      });
      throw new Error("expected updateDescription to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("hides a ticket from a tenant on a different lease", async () => {
    const t = makeBackend();
    const { staff, buildingId, unitId, tenantUserId } =
      await seedCurrentTenant(t);
    const otherUnitId = await asUser(t, staff.userId).mutation(
      api.units.create,
      {
        buildingId,
        label: "A4",
        kind: "apartment",
        newTenant: {
          displayName: "Sofia Herrera",
          email: "sofia.herrera@ridgeway.gh",
          startedOn: "2025-01-01",
        },
      }
    );
    const otherTenantUserId = await tenantUserIdByEmail(
      t,
      "sofia.herrera@ridgeway.gh"
    );
    const workOrderId = await asUser(t, tenantUserId).mutation(
      api.workOrders.createByTenant,
      {
        unitId,
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      }
    );

    try {
      await asUser(t, otherTenantUserId).query(api.workOrders.get, {
        workOrderId,
      });
      throw new Error("expected get to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    const otherList = await asUser(t, otherTenantUserId).query(
      api.workOrders.listForCurrentTenant,
      {}
    );
    expect(otherList).toEqual([]);
    expect(otherUnitId).toEqual(expect.any(String));
  });

  it("lets staff assign, the field worker schedule and complete, and keeps history", async () => {
    const t = makeBackend();
    const { staff, tenantUserId, unitId } = await seedCurrentTenant(t);
    const field = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });
    const workOrderId = await asUser(t, tenantUserId).mutation(
      api.workOrders.createByTenant,
      {
        unitId,
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      }
    );

    await asUser(t, staff.userId).mutation(api.workOrders.assign, {
      workOrderId,
      assigneeProfileId: field.profileId,
    });

    const assignedTicket = await asUser(t, field.userId).query(
      api.workOrders.get,
      { workOrderId }
    );
    expect(assignedTicket?.status).toBe("assigned");
    expect(assignedTicket?.canSchedule).toBe(true);
    expect(assignedTicket?.canComplete).toBe(false);
    expect(assignedTicket?.allowedNextStatuses).toEqual(["scheduled"]);

    const fieldList = await asUser(t, field.userId).query(
      api.workOrders.listForCurrentField,
      {}
    );
    expect(fieldList).toEqual([
      expect.objectContaining({
        _id: workOrderId,
        status: "assigned",
        unitLabel: "B12",
        buildingName: "Ridge Court",
        address: "14 Ridge Road, Cantonments, Accra",
      }),
    ]);

    await asUser(t, field.userId).mutation(api.workOrders.schedule, {
      workOrderId,
    });
    const storageId = await t.run(async (ctx) => {
      return await ctx.storage.store(new Blob(["done-photo"]));
    });
    await asUser(t, field.userId).mutation(api.files.attachToWorkOrder, {
      workOrderId,
      storageId,
      kind: "completion",
    });
    await asUser(t, field.userId).mutation(api.workOrders.complete, {
      workOrderId,
      note: "Tap washer replaced",
    });

    const forTenant = await asUser(t, tenantUserId).query(api.workOrders.get, {
      workOrderId,
    });
    const forStaff = await asUser(t, staff.userId).query(api.workOrders.get, {
      workOrderId,
    });
    expect(forTenant?.status).toBe("done");
    expect(forStaff?.status).toBe("done");
    expect(forStaff?.assigneeName).toBe("Yaw Darko");
    expect(forStaff?.completionPhotoUrls.length).toBe(1);
    expect(forTenant?.events.map((event) => event.toStatus)).toEqual([
      "done",
      "scheduled",
      "assigned",
      "received",
    ]);

    const doneList = await asUser(t, staff.userId).query(
      api.workOrders.listForStaff,
      { includeDone: true }
    );
    expect(doneList.map((row) => row._id)).toEqual([workOrderId]);
  });

  it("lets staff list open jobs for one field worker", async () => {
    const t = makeBackend();
    const { staff, tenantUserId, unitId } = await seedCurrentTenant(t);
    const yaw = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });
    const esi = await insertPerson(t, {
      email: "esi.mensah@ridgeway.gh",
      displayName: "Esi Mensah",
      role: "field",
    });
    const workOrderId = await asUser(t, tenantUserId).mutation(
      api.workOrders.createByTenant,
      {
        unitId,
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      }
    );

    await asUser(t, staff.userId).mutation(api.workOrders.assign, {
      workOrderId,
      assigneeProfileId: yaw.profileId,
    });

    const yawJobs = await asUser(t, staff.userId).query(
      api.workOrders.listForAssignee,
      { profileId: yaw.profileId }
    );
    expect(yawJobs).toEqual([
      expect.objectContaining({
        _id: workOrderId,
        title: "Kitchen tap leak",
        status: "assigned",
        assigneeName: "Yaw Darko",
      }),
    ]);

    const esiJobs = await asUser(t, staff.userId).query(
      api.workOrders.listForAssignee,
      { profileId: esi.profileId }
    );
    expect(esiJobs).toEqual([]);

    const staffList = await asUser(t, staff.userId).query(
      api.workOrders.listForStaff,
      {}
    );
    expect(staffList).toEqual([
      expect.objectContaining({
        _id: workOrderId,
        assigneeName: "Yaw Darko",
      }),
    ]);

    try {
      await asUser(t, yaw.userId).query(api.workOrders.listForAssignee, {
        profileId: yaw.profileId,
      });
      throw new Error("expected listForAssignee to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("refuses jumping to done before the ticket is scheduled", async () => {
    const t = makeBackend();
    const { staff, tenantUserId, unitId } = await seedCurrentTenant(t);
    const field = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });
    const workOrderId = await asUser(t, tenantUserId).mutation(
      api.workOrders.createByTenant,
      {
        unitId,
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      }
    );
    await asUser(t, staff.userId).mutation(api.workOrders.assign, {
      workOrderId,
      assigneeProfileId: field.profileId,
    });

    try {
      await asUser(t, field.userId).mutation(api.workOrders.complete, {
        workOrderId,
      });
      throw new Error("expected complete to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("INVALID");
    }
  });

  it("lets an owner see open issues on their buildings only", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    const ownerA = await insertPerson(t, {
      email: "kwesi.mensah@ridgeway.gh",
      displayName: "Kwesi Mensah",
      role: "owner",
    });
    const ownerB = await insertPerson(t, {
      email: "adwoa.owusu@ridgeway.gh",
      displayName: "Adwoa Owusu",
      role: "owner",
    });
    const ownerAId = ownerA.ownerId;
    const ownerBId = ownerB.ownerId;
    if (ownerAId === undefined || ownerBId === undefined) {
      throw new Error("expected owner ids");
    }

    const ownerABuildingId = await asUser(t, staff.userId).mutation(
      api.buildings.create,
      {
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
        ownerId: ownerAId,
      }
    );
    const ownerBBuildingId = await asUser(t, staff.userId).mutation(
      api.buildings.create,
      {
        name: "Labone walk-up",
        street: "32 Labone Crescent",
        area: "Labone",
        ownerId: ownerBId,
      }
    );
    const ownerAUnitId = await asUser(t, staff.userId).mutation(
      api.units.create,
      {
        buildingId: ownerABuildingId,
        label: "B12",
        kind: "apartment",
        newTenant: {
          displayName: "Akosua Darko",
          email: "akosua.darko@ridgeway.gh",
          startedOn: "2025-01-01",
        },
      }
    );
    const ownerBUnitId = await asUser(t, staff.userId).mutation(
      api.units.create,
      {
        buildingId: ownerBBuildingId,
        label: "A1",
        kind: "apartment",
        newTenant: {
          displayName: "Kojo Antwi",
          email: "kojo.antwi@ridgeway.gh",
          startedOn: "2025-01-01",
        },
      }
    );
    const ownerATenantUserId = await tenantUserIdByEmail(
      t,
      "akosua.darko@ridgeway.gh"
    );
    const ownerBTenantUserId = await tenantUserIdByEmail(
      t,
      "kojo.antwi@ridgeway.gh"
    );

    const ownerATicketId = await asUser(t, ownerATenantUserId).mutation(
      api.workOrders.createByTenant,
      {
        unitId: ownerAUnitId,
        description: "B12 leak",
        category: "plumbing",
        urgency: "normal",
      }
    );
    await asUser(t, ownerBTenantUserId).mutation(
      api.workOrders.createByTenant,
      {
        unitId: ownerBUnitId,
        description: "A1 lock",
        category: "other",
        urgency: "normal",
      }
    );

    const listed = await asUser(t, ownerA.userId).query(
      api.workOrders.listForOwner,
      {}
    );
    expect(listed).toEqual([
      expect.objectContaining({
        _id: ownerATicketId,
        title: "B12 leak",
        status: "received",
        unitLabel: "B12",
        unitKind: "apartment",
        tenantName: "Akosua Darko",
        buildingName: "Ridge Court",
      }),
    ]);
    expect(listed.map((row) => row.title)).not.toContain("A1 lock");

    const buildingList = await asUser(t, ownerA.userId).query(
      api.workOrders.listForBuilding,
      { buildingId: ownerABuildingId }
    );
    expect(buildingList.map((row) => row._id)).toEqual([ownerATicketId]);

    try {
      await asUser(t, ownerA.userId).query(api.workOrders.listForBuilding, {
        buildingId: ownerBBuildingId,
      });
      throw new Error("expected listForBuilding to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }

    try {
      await asUser(t, ownerATenantUserId).query(
        api.workOrders.listForOwner,
        {}
      );
      throw new Error("expected listForOwner to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });
});
