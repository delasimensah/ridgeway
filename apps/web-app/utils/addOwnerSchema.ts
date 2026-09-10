import { z } from "zod";

export const NEW_OWNER_CHOICE = "__new_owner__";

export const MIN_OWNER_PASSWORD_LENGTH = 8;

export const addOwnerSchema = z
  .object({
    displayName: z.string().trim().min(1, "Full name is required"),
    contactEmail: z.string().trim(),
    contactPhone: z.string().trim(),
    password: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.password.length === 0) {
      return;
    }

    if (values.contactEmail.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["contactEmail"],
        message: "Email is required to give a login",
      });
    }

    if (values.password.length < MIN_OWNER_PASSWORD_LENGTH) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must be at least 8 characters long",
      });
    }
  });

export type AddOwnerFormValues = z.infer<typeof addOwnerSchema>;
