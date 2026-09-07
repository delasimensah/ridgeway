import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

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
