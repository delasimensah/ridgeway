import { isValidEmail } from "shared";
import { z } from "zod";

import {
  addLeaseDateIssues,
  addLeaseRentIssues,
  isExistingTenantChoice,
  NEW_TENANT_CHOICE,
} from "./addTenantSchema";

export const UNIT_KINDS = ["apartment", "commercial"] as const;

export type UnitKind = (typeof UNIT_KINDS)[number];

export const UNIT_KIND_OPTIONS: { value: UnitKind; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial" },
];

export const addUnitSchema = z
  .object({
    label: z.string().trim().min(1, "Unit label is required"),
    kind: z.enum(UNIT_KINDS),
    tenantChoice: z.string().optional(),
    displayName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    rentAmount: z.string().optional(),
    rentDueDay: z.string().optional(),
    startedOn: z.string().optional(),
    endedOn: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const tenantChoice = values.tenantChoice ?? "";
    if (tenantChoice.length === 0) {
      return;
    }

    if (isExistingTenantChoice(tenantChoice)) {
      addLeaseDateIssues(values, ctx, true);
      addLeaseRentIssues(values, ctx);
      return;
    }

    if (tenantChoice !== NEW_TENANT_CHOICE) {
      return;
    }

    if (
      values.displayName === undefined ||
      values.displayName.trim().length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["displayName"],
        message: "Name is required",
      });
    }
    const email = values.email?.trim() ?? "";
    if (email.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Email is required",
      });
    } else if (!isValidEmail(email)) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Enter a valid email",
      });
    }
    addLeaseDateIssues(values, ctx, true);
    addLeaseRentIssues(values, ctx);
  });

export type AddUnitFormValues = z.infer<typeof addUnitSchema>;
