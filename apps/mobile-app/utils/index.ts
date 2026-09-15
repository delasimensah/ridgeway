// Utils Barrel Export
// Export all utilities from this file

// Navigation utilities
export { applyAvailableUpdate } from "./applyAvailableUpdate";
export { getConvexErrorMessage } from "./convexError";
export { createConvexClient } from "./convexClient";
export { bottomSafePad } from "./insets";
export { formatJobsHeadingDate } from "./jobDate";
export { JOB_STATUS_LABEL } from "./jobStatus";
export {
  formatRepairDateTime,
  REPAIR_CATEGORIES,
  REPAIR_CATEGORY_OPTIONS,
  REPAIR_URGENCIES,
  REPAIR_URGENCY_OPTIONS,
  repairCategoryLabel,
  repairMetaLine,
  repairUrgencyLabel,
  timelineStepState,
} from "./repairLabels";
export type { RepairCategory, RepairUrgency } from "./repairLabels";
export { defaultStackScreenOptions, screenPresets } from "./navigation";

// Toast utilities
export {
  showActiveToast,
  showErrorToast,
  showNeutralToast,
  showSuccessToast,
} from "./toastUtils";

// Import cn from shared package
export {
  COMPLETION_IMAGE_PICKER_OPTIONS,
  photoContentType,
  readCompletionPhotoAsset,
  uploadCompletionPhoto,
  uploadRepairPhoto,
} from "./uploadCompletionPhoto";
export { cn } from "shared";

// Add more utilities as needed:
// export { default as formatDate } from "./formatDate";
// export { default as validateEmail } from "./validation";
