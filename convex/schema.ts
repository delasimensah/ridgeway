import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const membershipRole = v.union(
  v.literal("staff"),
  v.literal("field"),
  v.literal("owner")
);

export default defineSchema({
  ...authTables,
  organizations: defineTable({
    name: v.string(),
  }),
  profiles: defineTable({
    userId: v.id("users"),
    displayName: v.string(),
    phone: v.optional(v.string()),
  }).index("by_userId", ["userId"]),
  memberships: defineTable({
    organizationId: v.id("organizations"),
    profileId: v.id("profiles"),
    role: membershipRole,
    ownerId: v.optional(v.id("owners")),
  })
    .index("by_profileId", ["profileId"])
    .index("by_organizationId_and_role", ["organizationId", "role"]),
  owners: defineTable({
    organizationId: v.id("organizations"),
    displayName: v.string(),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
  }).index("by_organizationId", ["organizationId"]),
  buildings: defineTable({
    organizationId: v.id("organizations"),
    ownerId: v.optional(v.id("owners")),
    name: v.string(),
    address: v.string(),
    houseRules: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_ownerId", ["ownerId"]),
  units: defineTable({
    buildingId: v.id("buildings"),
    label: v.string(),
    kind: v.union(v.literal("apartment"), v.literal("commercial")),
  }).index("by_buildingId", ["buildingId"]),
  leases: defineTable({
    unitId: v.id("units"),
    tenantProfileId: v.id("profiles"),
    startedOn: v.string(),
    endedOn: v.optional(v.string()),
  })
    .index("by_unitId", ["unitId"])
    .index("by_tenantProfileId", ["tenantProfileId"]),
  workOrders: defineTable({
    organizationId: v.id("organizations"),
    buildingId: v.id("buildings"),
    unitId: v.id("units"),
    leaseId: v.optional(v.id("leases")),
    status: v.union(
      v.literal("received"),
      v.literal("assigned"),
      v.literal("scheduled"),
      v.literal("done")
    ),
    title: v.string(),
    description: v.string(),
    category: v.optional(v.string()),
    urgency: v.union(v.literal("low"), v.literal("normal"), v.literal("high")),
    createdByProfileId: v.id("profiles"),
    assigneeProfileId: v.optional(v.id("profiles")),
    scheduledFor: v.optional(v.string()),
  })
    .index("by_buildingId_and_status", ["buildingId", "status"])
    .index("by_assigneeProfileId_and_status", ["assigneeProfileId", "status"])
    .index("by_leaseId", ["leaseId"])
    .index("by_organizationId_and_status", ["organizationId", "status"]),
  workOrderEvents: defineTable({
    workOrderId: v.id("workOrders"),
    actorProfileId: v.id("profiles"),
    fromStatus: v.optional(
      v.union(
        v.literal("received"),
        v.literal("assigned"),
        v.literal("scheduled"),
        v.literal("done")
      )
    ),
    toStatus: v.union(
      v.literal("received"),
      v.literal("assigned"),
      v.literal("scheduled"),
      v.literal("done")
    ),
    note: v.optional(v.string()),
  }).index("by_workOrderId", ["workOrderId"]),
  files: defineTable({
    workOrderId: v.id("workOrders"),
    storageId: v.id("_storage"),
    kind: v.union(v.literal("repair"), v.literal("completion")),
    uploadedByProfileId: v.id("profiles"),
  }).index("by_workOrderId", ["workOrderId"]),
  rentPeriods: defineTable({
    leaseId: v.id("leases"),
    periodLabel: v.string(),
    amount: v.number(),
    currency: v.union(v.literal("GHS"), v.literal("USD")),
    dueOn: v.string(),
    confirmedStatus: v.union(
      v.literal("unpaid"),
      v.literal("partial"),
      v.literal("paid")
    ),
    confirmedAmount: v.optional(v.number()),
    tenantReportedAt: v.optional(v.number()),
  }).index("by_leaseId_and_dueOn", ["leaseId", "dueOn"]),
});
