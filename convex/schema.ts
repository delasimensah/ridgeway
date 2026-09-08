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
});
