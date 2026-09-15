import type { WorkOrderStatus, WorkOrderUrgency } from "shared";

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

const TIMELINE_STEPS: WorkOrderStatus[] = [
  "received",
  "assigned",
  "scheduled",
  "done",
];

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
  return "";
}

export function repairUrgencyLabel(urgency: WorkOrderUrgency): string {
  if (urgency === "normal") {
    return "Medium";
  }
  return `${urgency.slice(0, 1).toUpperCase()}${urgency.slice(1)}`;
}

export function repairMetaLine(
  category: string | null,
  urgency: WorkOrderUrgency
): string {
  const categoryLabel = repairCategoryLabel(category);
  const urgencyLabel = `${repairUrgencyLabel(urgency)} Urgency`;
  if (categoryLabel.length === 0) {
    return urgencyLabel;
  }
  return `${categoryLabel} · ${urgencyLabel}`;
}

export function timelineStepState(
  current: WorkOrderStatus,
  step: WorkOrderStatus
): "completed" | "active" | "pending" {
  const currentIndex = TIMELINE_STEPS.indexOf(current);
  const stepIndex = TIMELINE_STEPS.indexOf(step);
  if (currentIndex > stepIndex) {
    return "completed";
  }
  if (current === step) {
    return "active";
  }
  return "pending";
}

export function formatRepairDateTime(ms: number): string {
  return new Date(ms).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
