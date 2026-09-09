import { z } from "zod";

import { NEW_OWNER_CHOICE } from "./addOwnerSchema";

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
  })
  .superRefine((values, ctx) => {
    if (values.ownerChoice !== NEW_OWNER_CHOICE) {
      return;
    }
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
  });

export type AddBuildingFormValues = z.infer<typeof addBuildingSchema>;
