import { getAuthUserId } from "@convex-dev/auth/server";
import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";

import type { Id } from "../_generated/dataModel";
import { action, mutation, query } from "../_generated/server";
import { ERROR_CODES, raise } from "./errors";
import { requireStaff, resolveViewer } from "./viewer";

export const authedQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const viewer = await resolveViewer(ctx);
    return { viewer };
  })
);

export const authedMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const viewer = await resolveViewer(ctx);
    return { viewer };
  })
);

export const staffQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const viewer = await requireStaff(ctx);
    return { viewer };
  })
);

export const staffMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const viewer = await requireStaff(ctx);
    return { viewer };
  })
);

export const staffAction = customAction(
  action,
  customCtx(async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      raise(ERROR_CODES.UNAUTHENTICATED);
    }

    return { staffUserId: userId as Id<"users"> };
  })
);
