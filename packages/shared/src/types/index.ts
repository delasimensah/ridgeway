export type MembershipRole = "staff" | "field" | "owner";

export type UserRole = "staff" | "owner" | "tenant" | "field";

export type WorkOrderStatus = "received" | "assigned" | "scheduled" | "done";

export type WorkOrderUrgency = "low" | "normal" | "high";

/** What staff have confirmed about a rent period. The only payment fact the backend stores. */
export type RentConfirmedStatus = "unpaid" | "partial" | "paid";

/** What a person sees for a rent period. "due" and "late" are derived from the due date and never stored. */
export type RentStatus = "paid" | "due" | "late" | "partial";

export type UnitKind = "apartment" | "commercial";

export type FileKind = "repair" | "completion";

export type Currency = "GHS" | "USD";
