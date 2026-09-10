// Utils Barrel Export
// Export all utilities from this file

export { cn } from "shared";

// Notification utilities
export {
  showErrorNotification,
  showInfoNotification,
  showSuccessNotification,
} from "./notificationUtils";
export { default as staffGreeting } from "./staffGreeting";
export {
  ACCRA_CITY,
  addBuildingSchema,
  type AddBuildingFormValues,
} from "./addBuildingSchema";
export {
  addUnitSchema,
  UNIT_KIND_OPTIONS,
  UNIT_KINDS,
  type AddUnitFormValues,
  type UnitKind,
} from "./addUnitSchema";
export {
  addOwnerSchema,
  NEW_OWNER_CHOICE,
  type AddOwnerFormValues,
} from "./addOwnerSchema";
export {
  addTenantSchema,
  isExistingTenantChoice,
  NEW_TENANT_CHOICE,
  utcToday,
  type AddTenantFormValues,
} from "./addTenantSchema";
export { getConvexErrorInfo, getConvexErrorMessage } from "./convexError";
export {
  fileRepairSchema,
  REPAIR_CATEGORIES,
  REPAIR_CATEGORY_OPTIONS,
  REPAIR_URGENCIES,
  REPAIR_URGENCY_OPTIONS,
  type FileRepairFormValues,
  type RepairCategory,
  type RepairUrgency,
} from "./fileRepairSchema";
export {
  formatRepairDate,
  repairCategoryLabel,
  repairEventTitle,
  repairStatusLabel,
  repairUrgencyLabel,
} from "./repairLabels";
export { uploadRepairPhoto } from "./uploadRepairPhoto";

// Add more utilities as needed:
// export { default as formatDate } from "./formatDate";
// export { default as validateEmail } from "./validation";
