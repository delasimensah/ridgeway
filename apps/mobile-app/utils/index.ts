// Utils Barrel Export
// Export all utilities from this file

// Navigation utilities
export { applyAvailableUpdate } from "./applyAvailableUpdate";
export { getConvexErrorMessage } from "./convexError";
export { createConvexClient } from "./convexClient";
export { bottomSafePad } from "./insets";
export { formatJobsHeadingDate } from "./jobDate";
export { JOB_STATUS_LABEL } from "./jobStatus";
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
} from "./uploadCompletionPhoto";
export { cn } from "shared";

// Add more utilities as needed:
// export { default as formatDate } from "./formatDate";
// export { default as validateEmail } from "./validation";
