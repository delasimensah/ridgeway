import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";

import { mutation, query } from "../_generated/server";
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
