import { z } from "zod";

export const REPAIR_CATEGORIES = ["plumbing", "electrical", "other"] as const;

export type RepairCategory = (typeof REPAIR_CATEGORIES)[number];

export const REPAIR_CATEGORY_OPTIONS: {
  value: RepairCategory;
  label: string;
}[] = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "other", label: "Other" },
];

export const REPAIR_URGENCIES = ["low", "normal", "high"] as const;

export type RepairUrgency = (typeof REPAIR_URGENCIES)[number];

export const REPAIR_URGENCY_OPTIONS: {
  value: RepairUrgency;
  label: string;
}[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Medium" },
  { value: "high", label: "High" },
];

export const fileRepairSchema = z.object({
  description: z.string().trim().min(1, "What’s wrong is required"),
  category: z.enum(REPAIR_CATEGORIES, {
    message: "Category is required",
  }),
  urgency: z.enum(REPAIR_URGENCIES, {
    message: "Urgency is required",
  }),
});

export type FileRepairFormValues = z.infer<typeof fileRepairSchema>;
