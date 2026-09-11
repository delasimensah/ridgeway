import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { internalAction } from "./_generated/server";
import { requirePassword, setAccountPassword } from "./lib/accountPassword";
import { ERROR_CODES, raise } from "./lib/errors";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile: (params) => {
        if (params.flow === "signUp") {
          throw new Error("Ask the office for an account.");
        }
        const email = params.email;
        if (typeof email !== "string" || email.length === 0) {
          throw new Error("Email is required");
        }
        return { email };
      },
    }),
  ],
});

export const setPassword = internalAction({
  args: {
    email: v.string(),
    password: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      raise(ERROR_CODES.INVALID, "Enter a valid email");
    }
    const password = requirePassword(args.password);
    await setAccountPassword(ctx, email, password);
    return null;
  },
});
