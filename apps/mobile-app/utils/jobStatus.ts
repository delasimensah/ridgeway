import type { WorkOrderStatus } from "shared";

import { COLORS } from "@/constants";

export const JOB_STATUS_LABEL: Record<WorkOrderStatus, string> = {
  received: "Received",
  assigned: "Assigned",
  scheduled: "Scheduled",
  done: "Done",
};

/** Left accent on job / repair cards — matches chip tones. */
export const JOB_STATUS_STRIPE: Record<WorkOrderStatus, string> = {
  received: COLORS.grey,
  assigned: COLORS.primaryHover,
  scheduled: COLORS.accent,
  done: COLORS.primary,
};
