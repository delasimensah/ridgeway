import { v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { ERROR_CODES, raise } from "./lib/errors";
import {
  authedMutation,
  authedQuery,
  staffMutation,
  staffQuery,
} from "./lib/functions";
import {
  currentLeaseForProfile,
  isCalendarDate,
  requireBuildingAccess,
  requireWorkOrderAccess,
  utcToday,
  type Viewer,
} from "./lib/viewer";

type WorkOrderStatus = "received" | "assigned" | "scheduled" | "done";

const ALLOWED_TRANSITIONS: Record<WorkOrderStatus, readonly WorkOrderStatus[]> =
  {
    received: ["assigned"],
    assigned: ["scheduled"],
    scheduled: ["done"],
    done: [],
  };

const workOrderStatus = v.union(
  v.literal("received"),
  v.literal("assigned"),
  v.literal("scheduled"),
  v.literal("done")
);

const workOrderUrgency = v.union(
  v.literal("low"),
  v.literal("normal"),
  v.literal("high")
);

const workOrderCategory = v.union(
  v.literal("plumbing"),
  v.literal("electrical"),
  v.literal("other")
);

const workOrderListItem = v.object({
  _id: v.id("workOrders"),
  title: v.string(),
  status: workOrderStatus,
  unitLabel: v.string(),
  buildingName: v.string(),
  address: v.string(),
  reportedAt: v.number(),
});

function requireText(value: string, field: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    raise(ERROR_CODES.INVALID, `${field} is required`);
  }
  return trimmed;
}

function titleFromDescription(description: string): string {
  const firstLine = description.split("\n")[0]?.trim() ?? "";
  if (firstLine.length <= 80) {
    return firstLine;
  }
  return `${firstLine.slice(0, 77).trimEnd()}...`;
}

async function currentLeaseOnUnit(
  ctx: { db: QueryCtx["db"] },
  viewer: Viewer,
  unitId: Id<"units">
): Promise<Doc<"leases">> {
  const lease = await currentLeaseForProfile(
    ctx,
    viewer.profile._id,
    utcToday()
  );
  if (lease === null || lease.unitId !== unitId) {
    raise(ERROR_CODES.NOT_PERMITTED);
  }
  return lease;
}

async function toListItem(
  ctx: { db: QueryCtx["db"] },
  ticket: Doc<"workOrders">
) {
  const unit = await ctx.db.get(ticket.unitId);
  const building = await ctx.db.get(ticket.buildingId);
  return {
    _id: ticket._id,
    title: ticket.title,
    status: ticket.status,
    unitLabel: unit?.label ?? "",
    buildingName: building?.name ?? "",
    address: building?.address ?? "",
    reportedAt: ticket._creationTime,
  };
}

function assertAllowedMove(from: WorkOrderStatus, to: WorkOrderStatus) {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    raise(ERROR_CODES.INVALID, "That status change is not allowed");
  }
}

function canMoveTicket(viewer: Viewer, ticket: Doc<"workOrders">): boolean {
  if (viewer.isStaff && viewer.organizationId === ticket.organizationId) {
    return true;
  }
  return ticket.assigneeProfileId === viewer.profile._id;
}

async function applyMove(
  ctx: { db: MutationCtx["db"] },
  viewer: Viewer,
  ticket: Doc<"workOrders">,
  toStatus: WorkOrderStatus,
  patch: {
    assigneeProfileId?: Id<"profiles">;
    scheduledFor?: string;
  },
  note?: string
) {
  assertAllowedMove(ticket.status, toStatus);
  const trimmedNote = note?.trim();
  await ctx.db.patch(ticket._id, {
    status: toStatus,
    ...patch,
  });
  await ctx.db.insert("workOrderEvents", {
    workOrderId: ticket._id,
    actorProfileId: viewer.profile._id,
    fromStatus: ticket.status,
    toStatus,
    ...(trimmedNote !== undefined && trimmedNote.length > 0
      ? { note: trimmedNote }
      : {}),
  });
}

export const listForStaff = staffQuery({
  args: {
    includeDone: v.optional(v.boolean()),
  },
  returns: v.array(workOrderListItem),
  handler: async (ctx, args) => {
    const organizationId = ctx.viewer.organizationId;
    if (organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }
    const includeDone = args.includeDone === true;
    const rows = await ctx.db
      .query("workOrders")
      .withIndex("by_organizationId_and_status", (q) =>
        q.eq("organizationId", organizationId)
      )
      .collect();
    const open = includeDone
      ? rows
      : rows.filter((row) => row.status !== "done");
    open.sort((a, b) => b._creationTime - a._creationTime);
    return await Promise.all(open.map((row) => toListItem(ctx, row)));
  },
});

export const listForBuilding = authedQuery({
  args: {
    buildingId: v.id("buildings"),
    includeDone: v.optional(v.boolean()),
  },
  returns: v.array(workOrderListItem),
  handler: async (ctx, args) => {
    await requireBuildingAccess(ctx, ctx.viewer, args.buildingId);
    const includeDone = args.includeDone === true;
    const rows = await ctx.db
      .query("workOrders")
      .withIndex("by_buildingId_and_status", (q) =>
        q.eq("buildingId", args.buildingId)
      )
      .collect();
    const open = includeDone
      ? rows
      : rows.filter((row) => row.status !== "done");
    open.sort((a, b) => b._creationTime - a._creationTime);
    return await Promise.all(open.map((row) => toListItem(ctx, row)));
  },
});

export const listForCurrentTenant = authedQuery({
  args: {},
  returns: v.array(workOrderListItem),
  handler: async (ctx) => {
    const lease = await currentLeaseForProfile(
      ctx,
      ctx.viewer.profile._id,
      utcToday()
    );
    if (lease === null) {
      return [];
    }

    const rows = await ctx.db
      .query("workOrders")
      .withIndex("by_leaseId", (q) => q.eq("leaseId", lease._id))
      .collect();
    const open = rows.filter((row) => row.status !== "done");
    open.sort((a, b) => b._creationTime - a._creationTime);
    return await Promise.all(open.map((row) => toListItem(ctx, row)));
  },
});

export const get = authedQuery({
  args: {
    workOrderId: v.id("workOrders"),
  },
  returns: v.union(
    v.object({
      _id: v.id("workOrders"),
      title: v.string(),
      description: v.string(),
      status: workOrderStatus,
      category: v.union(v.string(), v.null()),
      urgency: workOrderUrgency,
      unitLabel: v.string(),
      buildingName: v.string(),
      address: v.string(),
      buildingId: v.id("buildings"),
      tenantName: v.string(),
      assigneeName: v.union(v.string(), v.null()),
      scheduledFor: v.union(v.string(), v.null()),
      reportedAt: v.number(),
      canEditDescription: v.boolean(),
      canAssign: v.boolean(),
      canSchedule: v.boolean(),
      canComplete: v.boolean(),
      allowedNextStatuses: v.array(workOrderStatus),
      photoUrls: v.array(v.string()),
      completionPhotoUrls: v.array(v.string()),
      events: v.array(
        v.object({
          _id: v.id("workOrderEvents"),
          toStatus: workOrderStatus,
          actorName: v.string(),
          createdAt: v.number(),
        })
      ),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const ticket = await requireWorkOrderAccess(
      ctx,
      ctx.viewer,
      args.workOrderId,
      "read"
    );
    const unit = await ctx.db.get(ticket.unitId);
    const building = await ctx.db.get(ticket.buildingId);
    const tenant = await ctx.db.get(ticket.createdByProfileId);
    const events = await ctx.db
      .query("workOrderEvents")
      .withIndex("by_workOrderId", (q) => q.eq("workOrderId", ticket._id))
      .collect();
    const photos = await ctx.db
      .query("files")
      .withIndex("by_workOrderId", (q) => q.eq("workOrderId", ticket._id))
      .collect();
    const photoUrls: string[] = [];
    const completionPhotoUrls: string[] = [];
    for (const file of photos) {
      const url = await ctx.storage.getUrl(file.storageId);
      if (url === null) {
        continue;
      }
      if (file.kind === "repair") {
        photoUrls.push(url);
      } else {
        completionPhotoUrls.push(url);
      }
    }
    const assignee =
      ticket.assigneeProfileId === undefined
        ? null
        : await ctx.db.get(ticket.assigneeProfileId);
    const canMove = canMoveTicket(ctx.viewer, ticket);

    const eventRows = await Promise.all(
      events.map(async (event) => {
        const actor = await ctx.db.get(event.actorProfileId);
        return {
          _id: event._id,
          toStatus: event.toStatus,
          actorName: actor?.displayName ?? "",
          createdAt: event._creationTime,
        };
      })
    );
    eventRows.sort((a, b) => b.createdAt - a.createdAt);

    return {
      _id: ticket._id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      category: ticket.category ?? null,
      urgency: ticket.urgency,
      unitLabel: unit?.label ?? "",
      buildingName: building?.name ?? "",
      address: building?.address ?? "",
      buildingId: ticket.buildingId,
      tenantName: tenant?.displayName ?? "",
      assigneeName: assignee?.displayName ?? null,
      scheduledFor: ticket.scheduledFor ?? null,
      reportedAt: ticket._creationTime,
      canEditDescription:
        ticket.status === "received" &&
        ticket.createdByProfileId === ctx.viewer.profile._id,
      canAssign: ctx.viewer.isStaff && ticket.status === "received",
      canSchedule: canMove && ticket.status === "assigned",
      canComplete: canMove && ticket.status === "scheduled",
      allowedNextStatuses: canMove
        ? [...ALLOWED_TRANSITIONS[ticket.status]]
        : [],
      photoUrls,
      completionPhotoUrls,
      events: eventRows,
    };
  },
});

export const createByTenant = authedMutation({
  args: {
    unitId: v.id("units"),
    description: v.string(),
    category: workOrderCategory,
    urgency: workOrderUrgency,
  },
  returns: v.id("workOrders"),
  handler: async (ctx, args) => {
    const description = requireText(args.description, "What’s wrong");
    const lease = await currentLeaseOnUnit(ctx, ctx.viewer, args.unitId);
    const unit = await ctx.db.get(args.unitId);
    if (unit === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }
    const building = await ctx.db.get(unit.buildingId);
    if (building === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const workOrderId = await ctx.db.insert("workOrders", {
      organizationId: building.organizationId,
      buildingId: building._id,
      unitId: unit._id,
      leaseId: lease._id,
      status: "received",
      title: titleFromDescription(description),
      description,
      category: args.category,
      urgency: args.urgency,
      createdByProfileId: ctx.viewer.profile._id,
    });
    await ctx.db.insert("workOrderEvents", {
      workOrderId,
      actorProfileId: ctx.viewer.profile._id,
      toStatus: "received",
    });
    return workOrderId;
  },
});

export const updateDescription = authedMutation({
  args: {
    workOrderId: v.id("workOrders"),
    description: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const ticket = await requireWorkOrderAccess(
      ctx,
      ctx.viewer,
      args.workOrderId,
      "write"
    );
    if (
      ticket.status !== "received" ||
      ticket.createdByProfileId !== ctx.viewer.profile._id
    ) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }
    const description = requireText(args.description, "What’s wrong");
    await ctx.db.patch(args.workOrderId, {
      description,
      title: titleFromDescription(description),
    });
    return null;
  },
});

export const listForCurrentField = authedQuery({
  args: {},
  returns: v.array(workOrderListItem),
  handler: async (ctx) => {
    if (!ctx.viewer.isField) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const rows = await ctx.db
      .query("workOrders")
      .withIndex("by_assigneeProfileId_and_status", (q) =>
        q.eq("assigneeProfileId", ctx.viewer.profile._id)
      )
      .collect();
    const open = rows.filter((row) => row.status !== "done");
    open.sort((a, b) => b._creationTime - a._creationTime);
    return await Promise.all(open.map((row) => toListItem(ctx, row)));
  },
});

export const assign = staffMutation({
  args: {
    workOrderId: v.id("workOrders"),
    assigneeProfileId: v.id("profiles"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const ticket = await requireWorkOrderAccess(
      ctx,
      ctx.viewer,
      args.workOrderId,
      "write"
    );
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_profileId", (q) =>
        q.eq("profileId", args.assigneeProfileId)
      )
      .collect();
    const fieldMembership = memberships.find(
      (row) =>
        row.role === "field" && row.organizationId === ticket.organizationId
    );
    if (fieldMembership === undefined) {
      raise(ERROR_CODES.INVALID, "Pick a field worker in this organization");
    }

    await applyMove(ctx, ctx.viewer, ticket, "assigned", {
      assigneeProfileId: args.assigneeProfileId,
    });
    return null;
  },
});

export const schedule = authedMutation({
  args: {
    workOrderId: v.id("workOrders"),
    scheduledFor: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const ticket = await requireWorkOrderAccess(
      ctx,
      ctx.viewer,
      args.workOrderId,
      "write"
    );
    if (!canMoveTicket(ctx.viewer, ticket)) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }
    const scheduledFor =
      args.scheduledFor !== undefined && args.scheduledFor.trim().length > 0
        ? args.scheduledFor.trim()
        : utcToday();
    if (!isCalendarDate(scheduledFor)) {
      raise(ERROR_CODES.INVALID, "Enter a valid date");
    }

    await applyMove(ctx, ctx.viewer, ticket, "scheduled", { scheduledFor });
    return null;
  },
});

export const complete = authedMutation({
  args: {
    workOrderId: v.id("workOrders"),
    note: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const ticket = await requireWorkOrderAccess(
      ctx,
      ctx.viewer,
      args.workOrderId,
      "write"
    );
    if (!canMoveTicket(ctx.viewer, ticket)) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    await applyMove(ctx, ctx.viewer, ticket, "done", {}, args.note);
    return null;
  },
});
