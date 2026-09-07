import { v } from "convex/values";

import { ERROR_CODES, raise } from "./lib/errors";
import { staffQuery } from "./lib/functions";

export const getHome = staffQuery({
  args: {},
  returns: v.object({
    displayName: v.string(),
    organizationName: v.string(),
  }),
  handler: async (ctx) => {
    if (ctx.viewer.organizationId === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    const organization = await ctx.db.get(ctx.viewer.organizationId);
    if (organization === null) {
      raise(ERROR_CODES.NOT_PERMITTED);
    }

    return {
      displayName: ctx.viewer.profile.displayName,
      organizationName: organization.name,
    };
  },
});
