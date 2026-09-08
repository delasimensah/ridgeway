import { z } from "zod";

export const ACCRA_CITY = "Accra";

export const addBuildingSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  street: z.string().trim().min(1, "Street is required"),
  area: z.string().trim().min(1, "Area is required"),
});

export type AddBuildingFormValues = z.infer<typeof addBuildingSchema>;
