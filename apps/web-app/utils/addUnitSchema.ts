import { z } from "zod";

export const UNIT_KINDS = ["apartment", "commercial"] as const;

export type UnitKind = (typeof UNIT_KINDS)[number];

export const UNIT_KIND_OPTIONS: { value: UnitKind; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial" },
];

export const addUnitSchema = z.object({
  label: z.string().trim().min(1, "Unit label is required"),
  kind: z.enum(UNIT_KINDS),
});

export type AddUnitFormValues = z.infer<typeof addUnitSchema>;
