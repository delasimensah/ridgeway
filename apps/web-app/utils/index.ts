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
  utcToday,
  type AddTenantFormValues,
} from "./addTenantSchema";
export { getConvexErrorInfo, getConvexErrorMessage } from "./convexError";

// Add more utilities as needed:
// export { default as formatDate } from "./formatDate";
// export { default as validateEmail } from "./validation";
