import type { WorkOrderStatus } from "shared";

export const JOB_STATUS_LABEL: Record<WorkOrderStatus, string> = {
  received: "Received",
  assigned: "Assigned",
  scheduled: "Scheduled",
  done: "Done",
};
