import { z } from "zod";

export const scheduleRepairSchema = z.object({
  scheduledFor: z.string().min(1, "Pick a date"),
});

export type ScheduleRepairFormValues = z.infer<typeof scheduleRepairSchema>;
