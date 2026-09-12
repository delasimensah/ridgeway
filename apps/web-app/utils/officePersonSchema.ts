import { z } from "zod";

export const MIN_OFFICE_PASSWORD_LENGTH = 8;

export type OfficePersonFormValues = {
  displayName: string;
  email: string;
  password: string;
};

export const officePersonSchema = (isEdit: boolean) =>
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

      if (values.password.length < MIN_OFFICE_PASSWORD_LENGTH) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password must be at least 8 characters long",
        });
      }
    });
