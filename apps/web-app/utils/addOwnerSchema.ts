import { z } from "zod";

export const NEW_OWNER_CHOICE = "__new_owner__";

export const addOwnerSchema = z.object({
  displayName: z.string().trim().min(1, "Full name is required"),
  contactEmail: z.string().trim(),
  contactPhone: z.string().trim(),
});

export type AddOwnerFormValues = z.infer<typeof addOwnerSchema>;
