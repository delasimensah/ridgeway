import type { WorkOrderStatus, WorkOrderUrgency } from "shared";

const REPAIR_STATUS_LABEL: Record<WorkOrderStatus, string> = {
  received: "Received",
  assigned: "Assigned",
  scheduled: "Scheduled",
  done: "Done",
};

export function repairStatusLabel(status: WorkOrderStatus): string {
  return REPAIR_STATUS_LABEL[status];
}

export function repairCategoryLabel(category: string | null): string {
  if (category === "plumbing") {
    return "Plumbing";
  }
  if (category === "electrical") {
    return "Electrical";
  }
  if (category === "other") {
    return "Other";
  }
  return category ?? "—";
}

export function repairUrgencyLabel(urgency: WorkOrderUrgency): string {
  if (urgency === "normal") {
    return "Medium";
  }
  return `${urgency.slice(0, 1).toUpperCase()}${urgency.slice(1)}`;
}

export function repairEventTitle(status: WorkOrderStatus): string {
  if (status === "received") {
    return "Repair received";
  }
  if (status === "assigned") {
    return "Assigned to staff";
  }
  if (status === "scheduled") {
    return "Scheduled";
  }
  return "Marked done";
}

export function formatRepairDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
