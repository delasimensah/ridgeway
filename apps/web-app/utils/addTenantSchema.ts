import { isValidEmail } from "shared";
import { z } from "zod";

export const NEW_TENANT_CHOICE = "__new_tenant__";

export const MIN_TENANT_PASSWORD_LENGTH = 8;

export function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isExistingTenantChoice(
  tenantChoice: string | undefined
): boolean {
  return (
    tenantChoice !== undefined &&
    tenantChoice.length > 0 &&
    tenantChoice !== NEW_TENANT_CHOICE
  );
}

export function addLeaseDateIssues(
  values: { startedOn?: string; endedOn?: string },
  ctx: z.RefinementCtx,
  required: boolean
) {
  const startedOn = values.startedOn?.trim() ?? "";
  if (required && startedOn.length === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["startedOn"],
      message: "Lease start is required",
    });
  } else if (startedOn.length > 0 && startedOn > utcToday()) {
    ctx.addIssue({
      code: "custom",
      path: ["startedOn"],
      message: "Lease start must be today or earlier",
    });
  }
  const endedOn = values.endedOn?.trim() ?? "";
  if (endedOn.length > 0 && startedOn.length > 0 && endedOn < startedOn) {
    ctx.addIssue({
      code: "custom",
      path: ["endedOn"],
      message: "Lease end cannot be before the start date",
    });
  }
}

export const addTenantSchema = z
  .object({
    unitId: z.string().trim().min(1, "Unit is required"),
    tenantChoice: z.string().optional(),
    displayName: z.string().trim(),
    phone: z.string().trim(),
    email: z.string().trim(),
    startedOn: z.string().trim(),
    endedOn: z.string().trim(),
    password: z.string(),
  })
  .superRefine((values, ctx) => {
    if (!isExistingTenantChoice(values.tenantChoice)) {
      if (values.displayName.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["displayName"],
          message: "Name is required",
        });
      }
      if (values.email.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Email is required",
        });
      } else if (!isValidEmail(values.email)) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Enter a valid email",
        });
      }
      if (
        values.password.length > 0 &&
        values.password.length < MIN_TENANT_PASSWORD_LENGTH
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password must be at least 8 characters long",
        });
      }
    }
    addLeaseDateIssues(values, ctx, true);
  });

export type AddTenantFormValues = z.infer<typeof addTenantSchema>;
