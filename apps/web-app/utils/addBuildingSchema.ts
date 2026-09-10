import { z } from "zod";

import { MIN_OWNER_PASSWORD_LENGTH, NEW_OWNER_CHOICE } from "./addOwnerSchema";

export const ACCRA_CITY = "Accra";

export const addBuildingSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    street: z.string().trim().min(1, "Street is required"),
    area: z.string().trim().min(1, "Area is required"),
    ownerChoice: z.string().optional(),
    displayName: z.string().optional(),
    contactEmail: z.string().optional(),
    contactPhone: z.string().optional(),
    password: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const password = values.password ?? "";
    const grantingLogin = password.length > 0;

    if (values.ownerChoice === NEW_OWNER_CHOICE) {
      if (
        values.displayName === undefined ||
        values.displayName.trim().length === 0
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["displayName"],
          message: "Full name is required",
        });
      }
    }

    if (!grantingLogin) {
      return;
    }

    if (
      values.contactEmail === undefined ||
      values.contactEmail.trim().length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["contactEmail"],
        message: "Email is required to give a login",
      });
    }

    if (password.length < MIN_OWNER_PASSWORD_LENGTH) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must be at least 8 characters long",
      });
    }
  });

export type AddBuildingFormValues = z.infer<typeof addBuildingSchema>;
