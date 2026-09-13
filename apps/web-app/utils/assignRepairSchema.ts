import { z } from "zod";

export const assignRepairSchema = z.object({
  assigneeProfileId: z.string().min(1, "Pick a field worker"),
});

export type AssignRepairFormValues = z.infer<typeof assignRepairSchema>;
