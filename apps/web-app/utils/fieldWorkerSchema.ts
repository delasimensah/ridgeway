import { z } from "zod";

export const MIN_FIELD_PASSWORD_LENGTH = 8;

export type FieldWorkerFormValues = {
  displayName: string;
  email: string;
  password: string;
};

export const fieldWorkerSchema = (isEdit: boolean) =>
  z
    .object({
      displayName: z.string().trim().min(1, "Full name is required"),
      email: z.string().trim().min(1, "Email is required"),
      password: z.string(),
    })
    .superRefine((values, ctx) => {
      if (isEdit && values.password.length === 0) {
        return;
      }

      if (!isEdit && values.password.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password is required",
        });
        return;
      }

      if (values.password.length < MIN_FIELD_PASSWORD_LENGTH) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password must be at least 8 characters long",
        });
      }
    });
