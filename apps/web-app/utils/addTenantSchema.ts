import { isValidEmail } from "shared";
import { z } from "zod";

export function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export const addTenantSchema = z
  .object({
    unitId: z.string().trim().min(1, "Unit is required"),
    displayName: z.string().trim().min(1, "Name is required"),
    phone: z.string().trim(),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .refine(isValidEmail, "Enter a valid email"),
    startedOn: z.string().trim().min(1, "Lease start is required"),
    endedOn: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    if (values.startedOn > utcToday()) {
      ctx.addIssue({
        code: "custom",
        path: ["startedOn"],
        message: "Lease start must be today or earlier",
      });
    }
    if (values.endedOn.length > 0 && values.endedOn < values.startedOn) {
      ctx.addIssue({
        code: "custom",
        path: ["endedOn"],
        message: "Lease end cannot be before the start date",
      });
    }
  });

export type AddTenantFormValues = z.infer<typeof addTenantSchema>;
