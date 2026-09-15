# Convex design — Ridgeway

This document turns [system-design.md](./system-design.md) into the specific Convex tables, indexes, and functions we are going to write. Where the system design says "the function checks that this owner may see this building", this document says which file that check lives in and what it reads.

Read the system design first. If the two documents ever disagree, the system design is right and this one needs fixing.

Convex's own documentation is at [docs.convex.dev](https://docs.convex.dev), and the sign-in library's documentation is at [labs.convex.dev/auth](https://labs.convex.dev/auth). Where a function name or option below matters, check it against those pages before relying on it, because both move.

---

## 1. What is already in the repository

The `convex/` folder currently holds a deliberately thin start, and nothing about the product is in it yet.

- `convex/schema.ts` defines the schema with the sign-in tables spread into it and no product tables of its own.
- `convex/auth.ts` sets up Convex Auth with the Password provider, which is email and password sign-in.
- `convex/auth.config.ts` and `convex/http.ts` carry the wiring those need.

Everything in this document is added on top of that. The sign-in tables that `authTables` provides stay exactly as the library defines them, for the reason the system design gives: our product data must not depend on the shape of a beta library's tables.

---

## 2. How the folder is organised

One file per area of the product, named after the thing it deals with, plus a small number of shared pieces. A screen that wants the repairs for a building calls `workOrders.listForBuilding`, and that name tells you the file and the function.

- `convex/schema.ts` holds every table definition and index.
- `convex/lib/viewer.ts` resolves who is calling and holds the guards that decide whether that caller may touch a given building, ticket, or lease.
- `convex/lib/functions.ts` holds the wrapped ways of declaring a public function, which are what make the identity check impossible to omit. Every public function in the codebase is declared with one of these.
- `convex/lib/errors.ts` holds the single way we refuse a request.
- `convex/profiles.ts`, `convex/owners.ts`, `convex/buildings.ts`, `convex/units.ts`, `convex/leases.ts`, `convex/workOrders.ts`, `convex/rent.ts`, `convex/files.ts` hold the queries and mutations for each area.
- `convex/staff.ts` holds staff home today. Office-staff list, create, and password actions are added on RIDGE-31.
- `convex/field.ts` holds field-worker list, create, and password actions.
- `convex/seed.ts` and `convex/seedWorld.ts` hold the internal action that wipes the development database and inserts the demonstration world.
- `convex/ai.ts` holds the actions for the three optional language-model features, and is not written until those features are started.

Anything the client is not allowed to call directly is written as an `internalQuery`, `internalMutation`, or `internalAction`. Those are not reachable from the website or the phone at all, which is a stronger guarantee than a permission check, so anything that does not need to be public is internal.

---

## 3. The schema

Field names are in the code style the repository already uses, which is camel case. Every table below is defined in `convex/schema.ts` with `defineTable`, and the indexes are declared there too.

Convex gives every document an `_id` and a `_creationTime` automatically, so neither is listed below. Where a field points at another table, it uses `v.id("tableName")`, which is Convex's typed reference to a document in that table.

### organizations

One row per management company. The seed creates Ridgeway Property Group.

- `name`, a string, the display name of the firm.

No index. There is one row now and a handful ever, so it is always read by identifier.

### profiles

Our own record of a person who can sign in, kept separate from the sign-in tables.

- `userId`, a reference to the `users` document that `authTables` created for this login.
- `displayName`, a string, the name shown on screen.
- `phone`, an optional string.

Indexed by `userId`, because the very first thing every request does is turn a signed-in login into a profile. This is the single most-used index in the system.

### memberships

What the firm has granted a person. A person may have more than one row, though in practice most have one.

- `organizationId`, a reference to the organization.
- `profileId`, a reference to the profile.
- `role`, a union of the literal strings `"staff"`, `"field"`, and `"owner"`.
- `ownerId`, an optional reference to an owner, set only when the role is `"owner"`.

Indexed by `profileId`, so a request can read all of a caller's roles in one go. Also indexed by `organizationId` together with `role`, so staff screens can list the caretakers available to assign a job to.

Note that there is no `"tenant"` role. The system design explains why: whether a person currently rents a unit is answered by the lease, so that it can never disagree with the lease.

The requirements say one person should not casually hold owner access to two different owners' buildings. Convex has no unique constraint to declare that with, so the mutation that grants an owner membership reads the existing memberships for that profile first and refuses if one with the owner role is already there. Removing the old grant has to be a deliberate act rather than a side effect of adding a new one.

### owners

The person or company whose buildings Ridgeway manages.

- `organizationId`, a reference to the organization.
- `displayName`, a string.
- `contactEmail` and `contactPhone`, both optional strings.

Indexed by `organizationId`, for the staff screen that lists owners.

The owner record does not point back at a profile. The link from a login to an owner lives on the membership instead, so there is exactly one place that says which person may act for which owner.

### buildings

- `organizationId`, a reference to the organization.
- `ownerId`, a reference to the owner.
- `name`, a string.
- `address`, a string, a real-looking Accra address in the seed data.
- `houseRules`, an optional string, the text the house-rules chat will later answer from.

Indexed by `organizationId` for the staff portfolio screen, and by `ownerId` for the owner website. That second index is the owner wall in physical form: the owner query reads it with the owner identifier taken from the caller's membership, so it cannot return another owner's building.

### units

- `buildingId`, a reference to the building.
- `label`, a string, such as the flat number or shop name.
- `kind`, a union of the literal strings `"apartment"` and `"commercial"`, because the requirements say the portfolio is mostly apartments with a few small shops.

Indexed by `buildingId`.

### leases

- `unitId`, a reference to the unit.
- `tenantProfileId`, a reference to the tenant's profile.
- `startedOn`, a string holding a calendar date, which in the seed data is already in the past.
- `endedOn`, an optional string holding a calendar date, set by staff when the person moves out.
- `rentAmount`, an optional whole number of the currency's smallest unit (pesewas or cents). Absent means rent is not set on this lease.
- `rentCurrency`, optional, `"GHS"` or `"USD"`, present when `rentAmount` is set.
- `rentDueDay`, an optional day of the month from 1 to 31, present when `rentAmount` is set.

Indexed by `tenantProfileId`, which is how we answer "what does this tenant currently have access to" on every tenant request. Also indexed by `unitId`, for the staff screen showing who is in a unit.

Dates here are calendar dates rather than timestamps, stored as `YYYY-MM-DD` strings, because a tenancy ends on a day rather than at an instant, and because a string in that format sorts correctly. Convex's own `_creationTime` remains a timestamp and is unaffected.

**How a lease is judged current.** A lease is current when `endedOn` is absent, or when `endedOn` is a date not earlier than today. This comparison is written once, in `convex/lib/viewer.ts`, and never repeated inline, because the requirement that an ended tenancy loses access is one of the three that must never break.

### workOrders

The repair ticket.

- `organizationId`, a reference to the organization. Copied here on purpose.
- `buildingId`, a reference to the building. Copied here on purpose.
- `unitId`, a reference to the unit.
- `leaseId`, an optional reference to the lease the ticket was filed under, so a ticket stays attached to the tenancy that raised it even after that tenancy ends.
- `status`, a union of the literal strings `"received"`, `"assigned"`, `"scheduled"`, and `"done"`.
- `title` and `description`, strings, what the tenant reported.
- `category`, an optional string.
- `urgency`, a union of the literal strings `"low"`, `"normal"`, and `"high"`.
- `createdByProfileId`, a reference to the profile that filed it.
- `assigneeProfileId`, an optional reference to the caretaker's profile, set when staff assign it.
- `scheduledFor`, an optional string holding a calendar date.

Indexed by `buildingId` together with `status`, which serves the staff screen listing what is open in a building. Indexed by `assigneeProfileId` together with `status`, which serves the caretaker's job list. Indexed by `leaseId`, which serves the tenant's list of their own repairs. Indexed by `organizationId` together with `status`, which serves the staff home screen counting everything open across the portfolio.

The two copied fields, `organizationId` and `buildingId`, are what make the first and last of those indexes possible, and they are also what lets a permission check on a list of tickets avoid loading a unit and a building for every row. The system design records the promise that keeps them honest: a unit never moves to another building, and if that ever becomes possible, moving one is a migration that rewrites these fields.

### workOrderEvents

One row per change to a ticket. This is the history that makes a ticket auditable and is why nothing needs to be deleted.

- `workOrderId`, a reference to the work order.
- `actorProfileId`, a reference to the profile that made the change.
- `fromStatus` and `toStatus`, both the same union of status strings, with `fromStatus` optional because the first event is the ticket being created.
- `note`, an optional string.

Indexed by `workOrderId`. Convex's `_creationTime` orders the rows within a ticket, so we do not store our own timestamp.

### rentPeriods

- `leaseId`, a reference to the lease.
- `periodLabel`, a string such as `2026-09`, which is the month this period covers.
- `amount`, a whole number of the currency's smallest unit, so one thousand two hundred and fifty cedis and seventy-five pesewas is stored as `125075`.
- `currency`, a union of the literal strings `"GHS"` and `"USD"`, because the requirements allow the demonstration to show cedis and dollars.
- `dueOn`, a string holding a calendar date.
- `confirmedStatus`, a union of the literal strings `"unpaid"`, `"partial"`, and `"paid"`, which only staff may write.
- `confirmedAmount`, an optional whole number in the same unit as `amount`, how much staff confirmed arrived when the period is partly paid.
- `tenantReportedAt`, an optional number, the timestamp at which the tenant said they had paid.

Indexed by `leaseId` together with `dueOn`, which serves both the tenant's reminders and the owner's collected-against-outstanding totals in date order.

**Money is stored as a whole number of pesewas or cents, never as a decimal.** A decimal amount invites arithmetic that quietly loses a fraction of a unit, and a total that is off by one pesewa is a total we cannot explain to Ridgeway. Whole numbers cannot drift. Formatting a stored `125075` back into something a person reads as cedis and pesewas is done once, in `packages/shared`, alongside the other formatting helpers. The currency travels with the amount rather than being assumed, because the requirements allow both cedis and dollars in the same demonstration.

**There is no stored `late`.** A period is shown as late when its `dueOn` has passed and `confirmedStatus` is not `"paid"`, worked out when the data is read, so the database holds only what staff confirmed. An unpaid period whose `dueOn` has not passed yet is shown as due, not late, because a tenant who still has days to pay is not behind. The screens therefore show paid, due, late, or partial. The conversion is one function in `packages/shared` with this shape:

```ts
getRentDisplayStatus(
  period: { confirmedStatus: RentConfirmedStatus; dueOn: string },
  serverNow: number,
): RentStatus;
```

It takes the current time as an argument and never reads the clock itself, because a device's clock can be wrong and lateness is not something a phone gets to decide. Every query that returns rent periods also returns the backend's `serverNow`, and that is the value passed in. This function lands with the rent slice in the build order, not before.

### files

- `workOrderId`, a reference to the work order.
- `storageId`, a `v.id("_storage")`, which is Convex's reference to the stored bytes.
- `kind`, a union of the literal strings `"repair"` and `"completion"`, distinguishing the photo a tenant attached when reporting the problem from the photo a caretaker attached when finishing the work. These two values match the `FileKind` type that already exists in `packages/shared`.
- `uploadedByProfileId`, a reference to the profile that uploaded it.

Indexed by `workOrderId`.

---

## 4. Resolving the caller

This is the part of the codebase that everything else depends on, so it is written once, in `convex/lib/viewer.ts`, and used everywhere.

The viewer is what a function knows about its caller before it touches any product table.

```ts
type Viewer = {
  profileId: Id<"profiles">;
  organizationId: Id<"organizations">;
  isStaff: boolean;
  isField: boolean;
  ownerId: Id<"owners"> | null;
  currentLeaseIds: Id<"leases">[];
};
```

Building it takes three reads, in this order.

1. Get the signed-in account. With Convex Auth this is `getAuthUserId(ctx)` from `@convex-dev/auth/server`. If there is no account, the request is refused as unauthenticated.
2. Read the profile through the `by_userId` index on `profiles`. If there is no profile, the request is refused, because a login with no profile is a half-finished sign-up rather than a person with access.
3. Read the memberships through the `by_profileId` index on `memberships`, and read the current leases through the `by_tenantProfileId` index on `leases`, keeping only the leases that are current by the single rule described in section 3.

The organization comes from the membership when there is one, and from the building above the lease when the caller is only a tenant.

### The wrapped declarations

No public function is declared with Convex's plain `query` or `mutation`. Instead `convex/lib/functions.ts` exports wrapped versions, and the resolver above runs as part of the declaration rather than as a line in the body.

- `authedQuery` and `authedMutation` resolve the viewer and pass it to the handler as `ctx.viewer`. A handler declared this way cannot execute for a caller who is not signed in and has no profile.
- `staffQuery` and `staffMutation` do the same and additionally refuse a caller who is not staff, so the role requirement is visible in the declaration and cannot be deleted by editing the body.
- `staffAction` is the signed-in wrapper for actions. An action cannot read the database itself, so the handler then loads staff through an internal query. `createAccount` from Convex Auth can only run in an action, which is why granting a website login uses this wrapper rather than a mutation.

These are built with `customQuery` and `customMutation` from `convex-helpers/server/customFunctions`, which is Convex's own package for exactly this. It is one small dependency to add, and the exact shape of its API should be checked against [the convex-helpers documentation](https://github.com/get-convex/convex-helpers) when the first function is written, because I have not run it in this repository yet. If for any reason it does not fit, the fallback is a hand-written wrapper of our own that takes arguments and a handler and returns `query(...)`; the design does not depend on the package, only on the wrapping.

The one function that must not use these wrappers is `profiles.ensureForCurrentUser`, because it runs for a login that does not have a profile yet. It uses the plain `mutation` and reads the signed-in account directly, and it is the only place in the codebase permitted to do so.

### The record-level guards

These stay as explicit calls inside the handler, because which one a function needs is a real decision rather than a formality.

- `requireBuildingAccess(ctx, buildingId)` loads the building, then allows it when the caller is staff in that building's organization, or when the caller's `ownerId` equals the building's `ownerId`, or when one of the caller's current leases is on a unit in that building. Otherwise it refuses.
- `requireWorkOrderAccess(ctx, workOrderId, intent)` loads the ticket and decides against the copied `organizationId` and `buildingId` on the ticket itself. The `intent` argument distinguishes reading a ticket from moving it forward, because a tenant may read their own ticket but may not assign it.
- `requireLeaseAccess(ctx, leaseId)` allows staff in that organization, the owner of the building above the lease, and the tenant named on the lease while it is current.

The system design explains why the two jobs are split this way: forgetting the identity check is silent, so it is enforced, and record-level checks are the part a reader has to be able to see.

---

## 5. How a refusal looks

Refusals use `ConvexError` from `convex/values`, thrown from `convex/lib/errors.ts` with a small code the client can react to: one code for not signed in, one for not permitted, and one for a request that is not valid for the current state of the data, such as an illegal move on a repair ticket.

Two rules about refusals matter more than the mechanism.

**A forbidden record and a missing record are refused identically.** Both raise the not-permitted error. If a missing building said "not found" and a forbidden one said "not permitted", an owner could learn that another owner's building exists by the difference in the message.

**A refusal is never returned as an empty result.** A query that returns an empty list when the caller is not allowed to see something teaches the screens to treat forbidden as normal, and the requirements ask for a distinct screen for a person who does not have permission.

---

## 6. The functions

For each function below: who may call it, and what it checks. Every query listed as a list is read through the index named in section 3. Nothing here accepts an argument that widens what the caller can see.

Where a function is described as staff-only, that means it is declared with `staffQuery` or `staffMutation`, so the role requirement is part of the declaration. Everything else public is declared with `authedQuery` or `authedMutation`. The single exception is `profiles.ensureForCurrentUser`, for the reason given in section 4.

### Profiles and sign-in

- `profiles.getCurrent` is a query that returns the viewer's own profile along with the roles and current tenancies resolved for them, so the website and the phone can decide which screens to show. Every signed-in person may call it. This is the one function whose whole purpose is to describe the caller.
- `profiles.ensureForCurrentUser` is a mutation that creates the profile row for a login that does not have one yet. It writes only the row belonging to the calling login.
- There is no self-service forgot-password and no Password-provider email reset. Staff set a new password on an account they issued.
- `auth.setPassword` is an internal action. It takes an email and a new password and calls Convex Auth `modifyAccountCredentials`. It is not in the generated public API. Someone with Convex access runs it with `npx convex run` when the last remaining staff cannot sign in. Do not edit `authAccounts` in the Convex dashboard; the stored secret is hashed. How to run it: `docs/convex-auth-env.md`.

### Office staff

- `staff.listForStaff` is a staff-only query listing office people in the caller's organization. Each row includes email and whether they can sign in.
- `staff.get` is a staff-only query for the add-office-person form in edit.
- `staff.create` is a staff-only action. Staff type a name, email, and temporary password. It calls Convex Auth `createAccount`, then writes the profile and a staff membership (no `ownerId`). It refuses when that email already belongs to a login.
- `staff.update` is a staff-only mutation that corrects the typed name. It does not create a second login or change the password.
- `staff.setPassword` is a staff-only action. Staff type a new password on an office person who already has a login. It calls Convex Auth `modifyAccountCredentials`. An empty password on the form does not call it.

### Field workers

- `field.listForStaff` is a staff-only query listing field people in the caller's organization. Each row includes email and whether they can sign in.
- `field.get` is a staff-only query for the add-field-worker form in edit.
- `field.create` is a staff-only action. Staff type a name, email, and temporary password. It calls Convex Auth `createAccount`, then writes the profile and a field membership. It refuses when that email already belongs to a login.
- `field.update` is a staff-only mutation that corrects the typed name. It does not create a second login or change the password.
- `field.setPassword` is a staff-only action. Staff type a new password on a field worker who already has a login. It calls Convex Auth `modifyAccountCredentials`. An empty password on the form does not call it.

### Owners, buildings, and units

- `owners.listForStaff` is a staff-only query listing the owners in the caller's organization. The staff Owners page uses it. Each row includes whether that owner has a login and how many buildings they have.
- `owners.get` is a staff-only query for the staff owner page and the add-owner form in edit. It includes whether that owner already has a login and the buildings linked to them.
- `owners.create` and `owners.update` are staff-only mutations. They save contact details. They do not create a website login.
- `owners.grantLogin` is a staff-only action. Staff type an email and a temporary password, for a new owner or for an owner who still has no login. Add owner, edit owner, and add building all call it when a password is set on a person who does not yet have a login. It calls Convex Auth `createAccount`, then writes the owner row, the profile, and the owner membership. First grant only: it refuses when that email already belongs to a login (staff, field, another owner, or a tenant) and it refuses when the owner already has a login.
- `owners.setPassword` is a staff-only action. Staff type a new password on an owner who already has a login. It calls Convex Auth `modifyAccountCredentials`. An empty password on the form does not call it.
- `buildings.listForViewer` is a query available to any signed-in person, and it returns a different set depending on who they are: staff get the buildings in their organization, an owner gets the buildings whose `ownerId` matches their own membership, and a tenant gets only the building above their current lease. The scope always comes from the viewer and never from an argument. There is one function rather than three because the alternative is three functions with three chances to get the scoping wrong, and one function makes the comparison between the three cases visible in one screen of code. Each row includes `unitCount`, `emptyUnitCount` (units with no current lease), and `openRepairCount` (tickets that are not done).
- `buildings.get` is a query guarded by `requireBuildingAccess`.
- `buildings.create` and `buildings.update` are staff-only mutations. Creating a building requires the named owner to be in the caller's organization.
- `units.listByBuilding` is a query guarded by `requireBuildingAccess`.
- `units.create` and `units.update` are staff-only mutations. Create checks the parent building is in the caller's organization before writing. Update may change typed fields such as the unit label. It does not move a unit to another building.
- Where a staff (or tenant) mutation creates a typed field, there is a matching update on the same permission rules, unless a later rule freezes that field (work-order history, a confirmed rent period, ticket status).

### Leases and tenants

- `leases.listForStaff` is a staff-only query listing every tenant profile in the caller's organization. Each row includes the current lease (building and unit) when there is one, and none when the only leases have ended. New tenants are still created with a lease; this list does not invent a person who never rented.
- `leases.listByBuilding` is a query for staff and for that building's owner. The owner sees occupancy, so this is where an owner's view of who is in a unit comes from.
- `leases.createWithTenant` is a staff-only mutation that creates the tenant's profile if needed and the lease in one transaction, so a half-created tenancy cannot exist.
- `leases.updateTenant` is a staff-only mutation that corrects typed tenant and lease fields, including monthly rent and due day. It does not create a website login.
- `leases.grantLogin` is a staff-only action. Staff type an email and a temporary password, for a new tenant or for a tenant who still has no login. Add tenant and edit tenant call it when a password is set on a person who does not yet have a login. It calls Convex Auth `createAccount`, then attaches that Auth user to the tenant profile the lease already points at (or creates the profile and lease for a new tenant). First grant only: it refuses when that email already belongs to a login (staff, field, an owner, or another tenant) and it refuses when the tenant already has a login. `leases.get` includes whether that tenant already has a login.
- `leases.setPassword` is a staff-only action. Staff type a new password on a tenant who already has a login. It calls Convex Auth `modifyAccountCredentials`. An empty password on the form does not call it.
- `leases.end` is a staff-only mutation that sets `endedOn`. It writes one field and nothing else, because everything downstream of a tenancy ending is derived rather than stored. This single small mutation is what the ended-lease requirement rests on, and it is worth noticing how little it has to do.

### Work orders

- `workOrders.listForBuilding` is a query, guarded by `requireBuildingAccess`, returning tickets for that building newest first. It defaults to everything that is not done and offers done as an explicit filter (`includeDone`). Each row includes the tenant name when the ticket has a lease, and the unit kind.
- `workOrders.listForStaff` is a staff-only query returning tickets in the caller's organization, newest first, with the same not-done default. Each row includes `assigneeName` when a field worker is assigned.
- `workOrders.listForOwner` is a query for the caller's own buildings only, returning open tickets newest first. It refuses a field worker, a tenant, and staff.
- `workOrders.listForCurrentTenant` is a query returning the open tickets filed under the caller's current lease. Each row includes status, category, and urgency so the phone home and repairs list can show them.
- `workOrders.listForCurrentField` is a field-only query returning the open tickets assigned to the caller, newest first. It is a list, not a paginated query, because a caretaker's open jobs are a small set.
- `workOrders.listForAssignee` is a staff-only query returning the open tickets assigned to one field worker in the caller's organization, newest first. Each list row includes `assigneeName` (or none when the ticket is still unassigned).
- `workOrders.get` is a query, guarded by `requireWorkOrderAccess` for reading, that returns the ticket, its history rows, permission-checked URLs for repair and completion photos, and which moves the caller may make (`canAssign`, `canSchedule`, `canComplete`, `allowedNextStatuses`).
- `workOrders.createByTenant` is a mutation available to a tenant with a current lease on the unit. It refuses when the lease that would cover the ticket is not current, which is the second half of the ended-lease requirement. It creates the ticket at `"received"`, copies the organization and building from the unit's building at that moment, and writes the first history row in the same transaction.
- `workOrders.updateDescription` is a mutation available to the tenant who created the ticket, and only while status is still `"received"`.
- `workOrders.createByStaff` is the staff equivalent, for a repair that comes in by phone.
- `workOrders.assign` is a staff-only mutation that sets the assignee and moves the ticket to `"assigned"`. The assignee must have a field membership in that ticket's organization.
- `workOrders.schedule` is a mutation available to staff or the assigned caretaker. It sets `scheduledFor` (or today when the date is omitted) and moves the ticket to `"scheduled"`.
- `workOrders.complete` is a mutation available to the assigned caretaker or to staff, and it moves the ticket to `"done"`.
- `workOrders.updateClassification` is a staff-only mutation for correcting the category and urgency, including correcting whatever the optional language-model suggestion proposed.

There is one mutation per move rather than one that takes a target status, because each move has a different permission rule and a different set of fields to write, and a single function taking a status would mean one place deciding several unrelated questions.

### Rent

- `rent.listForCurrentTenant` is a query returning the caller's own periods for their current leases, together with `serverNow`.
- `rent.listByBuilding` is a paginated query for staff and for that building's owner. It takes an optional `periodLabel` (defaults to the current UTC month), returns that month's rows and Collected / Outstanding totals, `earliestPeriodLabel` for navigation, and per-row `arrears` from unpaid earlier months. Requested months after the current month or before the earliest charge are clamped. A tenant or field worker is refused even when they can otherwise see the building.
- `rent.listForStaff` is a staff-only query for the current UTC month across every building in the caller's organization. It returns Collected / Outstanding totals and each period's confirmed status and due date so the staff home can derive late, paid, and partial. It uses the same lease and period reads as `listByBuilding`.
- `rent.summaryForOwner` is a query for the caller's own buildings only, returning collected against outstanding as whole numbers in the same unit the periods are stored in, plus the same totals per building. It reads the periods for the leases under those buildings and adds them up at read time. At ten buildings that is a small number of documents. If the portfolio grew, this is the function that would change first, into a maintained total.

- `rent.chargeMonth` is an internal mutation that, for a given `YYYY-MM` month (or the current UTC month when omitted), inserts one unpaid `rentPeriods` row for every lease that covers that month, has rent set, and does not already have a row. Amount, currency, and due day come from the lease. Running it twice does not double-charge. Creating a lease calls the same helper for the current month so a new tenant appears on the rent page without waiting for the cron.
- `rent.setConfirmedStatus` is a staff-only mutation, and it is the only function in the system that writes `confirmedStatus`.
- `rent.reportPaymentByTenant` is a mutation available to the tenant on that lease, and it writes only `tenantReportedAt`. It cannot touch `confirmedStatus`, because that field is not among the ones it writes.

Every rent query returns `serverNow`, because the displayed status is derived on the client and a device's clock is not trusted to decide what is overdue. Owner totals are added up in the backend rather than on the client, because a total is a fact about money rather than a presentation choice, and because sending an owner every period so their browser can add them up would send far more data than the answer needs.

No rent function is callable by a field worker, and there is a test for that rather than a comment.

### Files

- `files.createUploadUrl` is a mutation that returns a short-lived upload address from `ctx.storage.generateUploadUrl()`. It first checks that the caller may attach a photo to the ticket they name, so an upload address is never handed to someone who could not use it legitimately.
- `files.attachToWorkOrder` is a mutation, called after the upload finishes, that records the stored file against the ticket. It repeats the permission check rather than trusting that the earlier call made it, because the two calls are separate requests. A `"repair"` photo is allowed while the ticket is `"received"`. A `"completion"` photo is allowed for staff or the assignee when the ticket is `"scheduled"` or `"done"`.

Photo URLs are produced with `ctx.storage.getUrl(storageId)` and only ever inside a query that has already checked access to the ticket. The system design records the limitation that such a URL can be fetched by anyone holding it.

---

## 7. The repair ticket's allowed moves

The moves are declared once, as data, in `convex/workOrders.ts`, so that the rule can be read in one place instead of being spread across four mutations.

```ts
const ALLOWED_TRANSITIONS = {
  received: ["assigned"],
  assigned: ["scheduled"],
  scheduled: ["done"],
  done: [],
} as const;
```

Each of the mutations that moves a ticket does the same four things, in this order.

1. Check who is calling and whether they may move this particular ticket.
2. Read the ticket from the database and confirm the move is allowed from the status that is stored there right now. The status the screen was showing is not consulted, because a caretaker's phone may have been showing a stale screen for ten minutes.
3. Write the ticket's new status and whatever fields belong to that move.
4. Insert the history row for the move.

Steps three and four are in the same mutation, and a Convex mutation is one transaction, so a ticket whose status changed without a history row cannot exist. Nothing deletes a ticket, at any step, ever.

If staff later need to undo an assignment, that is a new move added to the declaration above and a new mutation with its own permission rule, not a general "set the status to anything" function.

---

## 8. Scheduled and outside work

The first version needs almost none of this, which is deliberate.

There is one cron job in `convex/crons.ts`. At midnight UTC on the first of each month it runs `rent.chargeMonth` with no arguments, which charges every current lease for the new month. Lateness on rent is still worked out when the data is read, not stored by a job. That split is deliberate: generating the next month's rows needs a schedule; calling a period late does not.

The three optional language-model features go in `convex/ai.ts` as actions, because an action is the only Convex function type permitted to call the outside world. Each one reads the data it needs through an internal query rather than being handed data by the client, so the permission rules still apply to what the model sees. The provider's API key lives only in the Convex deployment's environment variables. The house-rules action may read only the `houseRules` text of the building it was asked about, and when that text does not answer the question it says so and points the person at the office. Nothing an action returns is treated as confirmed: a suggested category is editable, and the owner summary is a draft a staff member edits.

---

## 9. The seeded world

The seed is an `internalAction` in `convex/seed.ts`, so it cannot be triggered from the website or the phone. It is run from the Convex dashboard or the command line against a development deployment. The Accra people, buildings, leases, rent, and tickets live in `convex/seedWorld.ts`.

It first deletes product rows, auth users and accounts, and stored files, then inserts a fresh world. Re-running it replaces the old demo rather than stacking on it.

It creates Ridgeway Property Group, three owners, about ten buildings with real-looking Accra addresses, mostly apartments with a few small shops, three or more units on every building, mixed occupancy including vacant units and at least one ended lease, two years of rent periods (October 2024 through September 2026) in a believable mixture of paid, partly paid, unpaid, and tenant-reported, repair tickets spread across all four statuses including finished ones and units with more than one open ticket, house-rules text that differs enough between buildings to demonstrate the chat, and sign-ins for staff, each owner, several tenants, and two caretakers. Amounts are Ghana cedis except one owner whose buildings are US dollars, so owner totals stay in one currency.

The seed is part of the product, not a scratch script. The requirements are explicit that the screens must look expensive and that nobody is called "test user". A demonstration to Ridgeway is only as convincing as this data, so one building is deliberately busy (Ridge Court) and the rest are calmer, which is what a real portfolio looks like.

Because the seed creates sign-ins, it also creates the profile and membership rows those logins need, and it must create them in the same run so that no login exists without a profile. Passwords are one per role.

---

## 10. What the tests cover

**The `convex/` folder gets Vitest, and the three existing workspaces keep Jest.** Right now nothing runs against `convex/` at all: `apps/web-app`, `apps/mobile-app`, and `packages/shared` each run Jest, the root `test` script runs those three through Turborepo, and `convex/` sits at the root without being one of them.

Convex's testing library is `convex-test`, and according to [Convex's testing documentation](https://docs.convex.dev/testing/convex-test) it is used with Vitest. Two runners in one repository is a real cost and I am accepting it deliberately. The alternative worth weighing was converting all three existing suites to Vitest for the sake of having one runner, and that was rejected because it is a large change to three working test suites that buys this product nothing. Trying to force `convex-test` to run under Jest was rejected for a different reason: I have not verified that it works, and the tests below are the ones that guarantee an owner cannot read another owner's rent, so they are not the place to be experimenting with tooling.

What this means in practice, to be set up as part of the first build slice rather than left implied: a Vitest configuration at the repository root whose test files are limited to `convex/`, a `test:backend` script that runs it, and a root `test` script that runs both it and the Turborepo suites so neither can be skipped in review. The exact Vitest environment setting should be taken from the `convex-test` documentation at that point rather than from this file, because it is the kind of detail that changes between versions.

The tests live beside the functions they cover, following the repository's rules on test placement in [../testing-strategy.md](../testing-strategy.md).

Three tests are not optional and are written when the feature they cover is built, not later. They are the reason this section cannot be postponed: the guarantees they check are the ones the requirements call never-optional, and a guarantee nothing checks is a hope.

1. Signed in as the first owner, requesting the second owner's building directly by its identifier is refused. Signed in as staff of one organization, requesting a building in another organization that exists only in the test data is refused.
2. After a lease is ended, that same person can still sign in, but reading the unit is refused and filing a repair is refused.
3. A finished ticket is still found through the done filter, with its history rows intact.

Beyond those, every mutation has a test that a caller without the right role is refused, and the repair ticket has tests that an illegal move is refused and that a move which succeeds leaves exactly one history row.

---

## 11. The types the applications share, and the ones they must not

`packages/shared/src/types/index.ts` now holds the value sets this design uses, and they are already aligned with it: `MembershipRole` for what is stored on a membership, `UserRole` for deciding which set of screens to show a person, `WorkOrderStatus` and `WorkOrderUrgency`, `RentConfirmedStatus` for what staff confirmed and `RentStatus` for what a person sees, `UnitKind`, `FileKind`, and `Currency`.

Three rules keep that file from becoming a second, competing definition of the product.

**Stored and displayed sets are separate types with separate names.** `RentConfirmedStatus` and `RentStatus` are the example, and `MembershipRole` and `UserRole` are the other. A membership row can say staff, field, or owner. A screen can be showing a tenant, which is not a membership at all but the consequence of holding a current lease. Merging either pair into one type is how a derived value gets written into the database, or how someone goes looking for a tenant membership row that does not exist.

**The shape of a record is never restated here.** Convex generates document types from `convex/schema.ts` into `convex/_generated/dataModel`, and those are the types the applications use for a building or a ticket. A hand-written `Building` interface in the shared package would be a second definition that drifts the first time a field is added.

**Values that only the backend uses stay in the backend.** The set of allowed status moves in section 7 is a backend rule, not a shared value set, because no screen needs to know it: a screen is told which actions are available by what the backend returns.

The scaffolded `User` interface and `ApiResponse<T>` wrapper have been removed from that file. Nothing imported them, and both would have misled: the person a screen knows about is the viewer resolved in section 4, and Convex functions return their value directly rather than inside an envelope, so an `ApiResponse<T>` would only invite someone to wrap a result that is not shaped that way.
