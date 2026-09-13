import { v } from "convex/values";

import { ERROR_CODES, raise } from "./lib/errors";
import { authedMutation } from "./lib/functions";
import { requireWorkOrderAccess } from "./lib/viewer";

export const createUploadUrl = authedMutation({
  args: {
    workOrderId: v.id("workOrders"),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    await requireWorkOrderAccess(ctx, ctx.viewer, args.workOrderId, "write");
    return await ctx.storage.generateUploadUrl();
  },
});

export const attachToWorkOrder = authedMutation({
  args: {
    workOrderId: v.id("workOrders"),
    storageId: v.id("_storage"),
    kind: v.union(v.literal("repair"), v.literal("completion")),
  },
  returns: v.id("files"),
  handler: async (ctx, args) => {
    const ticket = await requireWorkOrderAccess(
      ctx,
      ctx.viewer,
      args.workOrderId,
      "write"
    );
    if (args.kind === "repair" && ticket.status !== "received") {
      raise(ERROR_CODES.INVALID, "This repair is past received");
    }
    if (args.kind === "completion") {
      const isAssignee = ticket.assigneeProfileId === ctx.viewer.profile._id;
      if (!ctx.viewer.isStaff && !isAssignee) {
        raise(ERROR_CODES.NOT_PERMITTED);
      }
      if (ticket.status !== "scheduled" && ticket.status !== "done") {
        raise(
          ERROR_CODES.INVALID,
          "Add the completion photo when the job is scheduled or done"
        );
      }
    }

    return await ctx.db.insert("files", {
      workOrderId: args.workOrderId,
      storageId: args.storageId,
      kind: args.kind,
      uploadedByProfileId: ctx.viewer.profile._id,
    });
  },
});
