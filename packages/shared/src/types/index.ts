export type UserRole = "staff" | "owner" | "tenant" | "field";

export type WorkOrderStatus =
  | "received"
  | "assigned"
  | "scheduled"
  | "done";

export type RentStatus = "paid" | "late" | "partial";

export type UnitKind = "apartment" | "commercial";

export type FileKind = "repair" | "completion";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
