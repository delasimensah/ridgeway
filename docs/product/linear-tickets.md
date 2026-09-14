# Linear tickets — Ridgeway

Build order for this product. Issues live on Linear team [Ridgeway](https://linear.app/dm-studios/team/RIDGE) (`RIDGE`). Assigned to Delasi Mensah.

Projects:

- [First Version](https://linear.app/dm-studios/project/first-version-2e4b841a6448) — product slices
- [Launch](https://linear.app/dm-studios/project/launch-10a9121e69b0) — TestFlight and Play

Screen HTML lives in `docs/ui-design/ridgeway/exports/`. Each issue body links the exports for that journey. Rebuild with this repo's components. Do not paste UX Pilot markup into the app.

Implement one issue at a time. Branch `feature/RIDGE-n`. Product schema and Convex functions start with [RIDGE-1](https://linear.app/dm-studios/issue/RIDGE-1/staff-can-sign-in-on-the-website).

---

## Status now

Board flow: **Todo → In Progress → Done**. Backlog is later work only.

- [RIDGE-1](https://linear.app/dm-studios/issue/RIDGE-1/staff-can-sign-in-on-the-website) is **Done**.
- [RIDGE-2](https://linear.app/dm-studios/issue/RIDGE-2/staff-can-add-one-building-and-see-it-in-a-list) is **Done**.
- [RIDGE-25](https://linear.app/dm-studios/issue/RIDGE-25/staff-can-correct-a-building-they-already-added) is **Done**.
- [RIDGE-3](https://linear.app/dm-studios/issue/RIDGE-3/staff-can-add-a-unit-under-a-building) is **Done**.
- [RIDGE-4](https://linear.app/dm-studios/issue/RIDGE-4/staff-can-add-an-owner-and-a-tenant-with-a-lease-that-already-started) is **Done**.
- [RIDGE-5](https://linear.app/dm-studios/issue/RIDGE-5/owner-a-cannot-see-owner-bs-buildings) is **Done**.
- [RIDGE-27](https://linear.app/dm-studios/issue/RIDGE-27/staff-can-give-an-owner-a-login) is **Done**.
- [RIDGE-6](https://linear.app/dm-studios/issue/RIDGE-6/tenant-can-file-a-repair-with-a-photo-and-see-status-received) is **Done**.
- [RIDGE-29](https://linear.app/dm-studios/issue/RIDGE-29/staff-can-give-a-tenant-a-login) is **Done**.
- [RIDGE-30](https://linear.app/dm-studios/issue/RIDGE-30/staff-can-set-a-new-password-on-an-existing-owner-or-tenant-login) is **Done**.
- [RIDGE-32](https://linear.app/dm-studios/issue/RIDGE-32/staff-can-see-every-tenant-with-or-without-a-current-lease) is **Done**.
- [RIDGE-33](https://linear.app/dm-studios/issue/RIDGE-33/staff-can-see-every-owner-without-opening-a-building) is **Done**.
- [RIDGE-31](https://linear.app/dm-studios/issue/RIDGE-31/staff-can-add-another-office-person) is **Done**.
- [RIDGE-34](https://linear.app/dm-studios/issue/RIDGE-34/staff-can-add-a-field-worker-and-see-them-on-a-list) is **Done**.
- [RIDGE-7](https://linear.app/dm-studios/issue/RIDGE-7/field-worker-can-move-a-job-received-assigned-scheduled-done-and) is **Done**.
- [RIDGE-35](https://linear.app/dm-studios/issue/RIDGE-35/field-app-completion-photo-uploads-on-device-android-system-bar) is **Done**.
- [RIDGE-8](https://linear.app/dm-studios/issue/RIDGE-8/after-staff-end-a-lease-that-tenant-cannot-see-the-unit) is **Done**.
- [RIDGE-9](https://linear.app/dm-studios/issue/RIDGE-9/tenant-sees-a-rent-reminder-and-can-mark-a-payment-as-reported) is **Done**.
- [RIDGE-36](https://linear.app/dm-studios/issue/RIDGE-36/rent-amount-and-due-day-live-on-the-lease) is **Done**.
- [RIDGE-28](https://linear.app/dm-studios/issue/RIDGE-28/a-person-can-reset-a-forgotten-password-from-sign-in) is **Canceled** (self-service forgot-password). Staff set passwords instead.
- Next slice is [RIDGE-37](https://linear.app/dm-studios/issue/RIDGE-37/every-current-lease-is-charged-rent-each-month), then [RIDGE-38](https://linear.app/dm-studios/issue/RIDGE-38/staff-can-open-an-earlier-month-and-see-what-a-tenant-still-owes). Rent on the lease is stored; monthly charging and past months are still open, so the command center would still lose rows at month start until those land.
- [RIDGE-10](https://linear.app/dm-studios/issue/RIDGE-10/staff-command-center-shows-open-work-orders-and-rent-status-across) (staff command center) follows.
- RIDGE-37, RIDGE-38, RIDGE-10 through RIDGE-15, and the epics are **Todo**.
- RIDGE-16, RIDGE-17, RIDGE-18, and RIDGE-26 stay **Backlog** until RIDGE-1 through RIDGE-13 are done.

When a slice is started, move that issue to In Progress immediately. Do not use Backlog for queued first-version work. Linear stays In Progress until merge to `main`. In the feature PR, write this Status now block as that post-merge board.

---

## Epics

Parent issues. Children sit under them.

- [RIDGE-19 Auth](https://linear.app/dm-studios/issue/RIDGE-19/epic-auth) — sign in, roles, sign out, staff-issued logins and passwords
- [RIDGE-20 Staff portfolio](https://linear.app/dm-studios/issue/RIDGE-20/epic-staff-portfolio) — command center, add and correct building, unit, owner, tenant, office person, end lease; staff lists of tenants and owners
- [RIDGE-21 Owner isolation](https://linear.app/dm-studios/issue/RIDGE-21/epic-owner-isolation) — an owner sees only their buildings
- [RIDGE-22 Work orders](https://linear.app/dm-studios/issue/RIDGE-22/epic-work-orders) — tenant files a repair, field update, photos
- [RIDGE-23 Rent status](https://linear.app/dm-studios/issue/RIDGE-23/epic-rent-status) — paid, late, or partial; tenant reported payment
- [RIDGE-24 Launch](https://linear.app/dm-studios/issue/RIDGE-24/epic-launch) — seed look, empty states, TestFlight, Play

---

## First slices (a person can tap these)

1. [RIDGE-1 Staff can sign in on the website](https://linear.app/dm-studios/issue/RIDGE-1/staff-can-sign-in-on-the-website) — Auth. Web. Also Vitest for `convex/` and `convex-helpers` wrappers. Design: `exports/web/staff/sign-in.html`.
2. [RIDGE-2 Staff can add one building and see it in a list](https://linear.app/dm-studios/issue/RIDGE-2/staff-can-add-one-building-and-see-it-in-a-list) — Staff portfolio. Design: `exports/web/staff/building-list.html`, `add-building.html`.
3. [RIDGE-25 Staff can correct a building they already added](https://linear.app/dm-studios/issue/RIDGE-25/staff-can-correct-a-building-they-already-added) — Staff portfolio. Same add-building form in edit mode. Typed name and address.
4. [RIDGE-3 Staff can add a unit under a building](https://linear.app/dm-studios/issue/RIDGE-3/staff-can-add-a-unit-under-a-building) — Staff portfolio. Design: `exports/web/staff/building-detail.html`, `add-unit.html`. Includes correcting the unit label.
5. [RIDGE-4 Staff can add an owner and a tenant with a lease that already started](https://linear.app/dm-studios/issue/RIDGE-4/staff-can-add-an-owner-and-a-tenant-with-a-lease-that-already-started) — Staff portfolio. Design: `exports/web/staff/add-owner.html`, `add-tenant.html`. Includes correcting typed owner and tenant fields.
6. [RIDGE-5 Owner A cannot see Owner B's buildings](https://linear.app/dm-studios/issue/RIDGE-5/owner-a-cannot-see-owner-bs-buildings) — Owner isolation. Design: `exports/web/owner/home.html`. Integration tests on Convex functions.
7. [RIDGE-27 Staff can give an owner a login](https://linear.app/dm-studios/issue/RIDGE-27/staff-can-give-an-owner-a-login) — Auth. New owners and owners already saved. Email and a temporary password on add owner and on edit owner. Convex `createAccount` (staff action) plus owner membership. First grant only on this slice. Tenant and field logins are not this ticket. Design: `exports/web/staff/add-owner.html` (same form in edit; no new screen). Full text in **RIDGE-27** below.
8. [RIDGE-6 Tenant can file a repair with a photo and see status received](https://linear.app/dm-studios/issue/RIDGE-6/tenant-can-file-a-repair-with-a-photo-and-see-status-received) — Work orders. Design: `exports/web/tenant/file-repair.html`. Includes correcting the typed description while the ticket is still received. Full text in **RIDGE-6** below.
9. [RIDGE-29 Staff can give a tenant a login](https://linear.app/dm-studios/issue/RIDGE-29/staff-can-give-a-tenant-a-login) — Auth. Same pattern as owner login. Email and a temporary password on add tenant and edit tenant. First grant only on this slice. Design: `exports/web/staff/add-tenant.html`. Full text in **RIDGE-29** below.
10. [RIDGE-30 Staff can set a new password on an existing owner or tenant login](https://linear.app/dm-studios/issue/RIDGE-30/staff-can-set-a-new-password-on-an-existing-owner-or-tenant-login) — Auth. Edit owner and edit tenant. Convex `modifyAccountCredentials`. Internal `auth.setPassword` for a last remaining staff lockout. No Forgot? on sign-in. Full text in **RIDGE-30** below.
11. [RIDGE-32 Staff can see every tenant, with or without a current lease](https://linear.app/dm-studios/issue/RIDGE-32/staff-can-see-every-tenant-with-or-without-a-current-lease) — Staff portfolio. Tenants sidebar list. Design not locked. Full text in **RIDGE-32** below.
12. [RIDGE-33 Staff can see every owner without opening a building](https://linear.app/dm-studios/issue/RIDGE-33/staff-can-see-every-owner-without-opening-a-building) — Staff portfolio. Owners sidebar list. Design not locked. Full text in **RIDGE-33** below.
13. [RIDGE-31 Staff can add another office person](https://linear.app/dm-studios/issue/RIDGE-31/staff-can-add-another-office-person) — Auth. Name, email, temporary password. Later set a new password on that login. Design not locked. Full text in **RIDGE-31** below.
14. [RIDGE-34 Staff can add a field worker and see them on a list](https://linear.app/dm-studios/issue/RIDGE-34/staff-can-add-a-field-worker-and-see-them-on-a-list) — Auth. Staff hire a caretaker (name, email, temporary password) and see them on a list. Seed is demo only. Design not locked. Full text in **RIDGE-34** below.
15. [RIDGE-7 Field worker can move a job received → assigned → scheduled → done and attach a completion photo](https://linear.app/dm-studios/issue/RIDGE-7/field-worker-can-move-a-job-received-assigned-scheduled-done-and) — Work orders. Blocked by RIDGE-34. Design: `exports/mobile/field/job-detail.html`.
16. [RIDGE-35 Field app: completion photo uploads on device, Android system bar, keyboard, and password visibility](https://linear.app/dm-studios/issue/RIDGE-35/field-app-completion-photo-uploads-on-device-android-system-bar) — Work orders. Follow-up on RIDGE-7. Full text in **RIDGE-35** below.
17. [RIDGE-8 After staff end a lease, that tenant cannot see the unit](https://linear.app/dm-studios/issue/RIDGE-8/after-staff-end-a-lease-that-tenant-cannot-see-the-unit) — Staff portfolio. Design: `exports/web/staff/end-lease.html`, `exports/web/tenant/lease-ended.html`.
18. [RIDGE-9 Tenant sees a rent reminder and can mark a payment as reported](https://linear.app/dm-studios/issue/RIDGE-9/tenant-sees-a-rent-reminder-and-can-mark-a-payment-as-reported) — Rent. Design: `exports/web/tenant/rent.html`, `exports/web/staff/rent-list.html`.

---

## RIDGE-27. Staff can give an owner a login

**Epic:** Auth ([RIDGE-19](https://linear.app/dm-studios/issue/RIDGE-19/epic-auth))  
**Apps:** web, Convex  
**Branch:** `feature/RIDGE-27`

Staff can give a person a website login for an owner. That includes a **new** owner and an owner **already saved** who still has no login. Without the edit path, owners added in RIDGE-4 cannot sign in.

**Design:**

- Export: `docs/ui-design/ridgeway/exports/web/staff/add-owner.html`
- Same add-owner form in edit. Password field added. No new screen.

**Who gets a login**

- New owner: staff may type email and a temporary password when they add the owner (`/owners/new`, add a new owner on a building, or add a building with a new owner). If they set a password, email is required and the login is created on that save.
- Existing owner with no login: staff open **Edit owner** on the building (same place as Add owner), or pick that owner on add owner / add building, type email and a temporary password, and save.
- Existing owner who already has a login (including seed Kwesi and Adwoa): the form shows they can sign in. Do not create a second account. Do not change the password.

**How it is built**

- Staff type email and password. They do not pick a profile id. The existing `owners.grantMembership` mutation is not the staff UI.
- `createAccount` cannot run inside `owners.create` or `owners.update`. Use a staff-callable action (same pattern as seed), then write the profile and the owner membership.
- No public sign-up. Sign-up on the sign-in screen stays refused.

**Rules**

- First grant only. No forgot-password and no reset on this slice. A mistyped temporary password cannot be fixed here.
- Contact email stays optional when staff are not granting a login. Email is required when they are.
- Refuse the email if it already belongs to staff, field, another owner's login, or a tenant (tenants already have a `users` row by email).
- Add building or assign-on-building may still save an owner with no login. Staff can grant that login later from edit, or from the password field when they pick that owner.

**Acceptance (yes or no)**

- Staff add a new owner with email and a temporary password. That person can sign in and see only that owner's buildings.
- Staff open an owner who was saved earlier with no login, set email and a temporary password, save. That person can sign in the same way.
- Staff open an owner who already has a login. Save does not create another account and does not change the password.
- The same email as Ama, Yaw, another owner login, or a tenant is refused with a clear error.
- A person who is not staff cannot create an owner account from sign-in.
- Tests cover grant on create, grant on edit, refuse when a login already exists, and refuse a taken email.

**Out of scope**

- Tenant login and field login (same pattern on those slices later).
- Setting a new password after the first grant ([RIDGE-30](https://linear.app/dm-studios/issue/RIDGE-30/staff-can-set-a-new-password-on-an-existing-owner-or-tenant-login)).
- Occupancy, open issues, and rent on owner home (RIDGE-11).

---

## RIDGE-28. A person can reset a forgotten password from sign-in — Canceled

**Epic:** Auth ([RIDGE-19](https://linear.app/dm-studios/issue/RIDGE-19/epic-auth))

Canceled. Passwords are staff-managed, not a self-service email link. Seed addresses are not real mailboxes.

Replacement:

- [RIDGE-30](https://linear.app/dm-studios/issue/RIDGE-30/staff-can-set-a-new-password-on-an-existing-owner-or-tenant-login)
- [RIDGE-31](https://linear.app/dm-studios/issue/RIDGE-31/staff-can-add-another-office-person)

---

## RIDGE-30. Staff can set a new password on an existing owner or tenant login

**Epic:** Auth ([RIDGE-19](https://linear.app/dm-studios/issue/RIDGE-19/epic-auth))
**Apps:** web, Convex
**Branch:** `feature/RIDGE-30`

Staff can type a new password on an owner or tenant who already has a login. Ridgeway issues these accounts; there is no self-service forgot-password. [RIDGE-28](https://linear.app/dm-studios/issue/RIDGE-28/a-person-can-reset-a-forgotten-password-from-sign-in) is canceled.

**Design:**

- Add / edit owner: `docs/ui-design/ridgeway/exports/web/staff/add-owner.html` (same form; password field usable after the first grant)
- Add / edit tenant: `docs/ui-design/ridgeway/exports/web/staff/add-tenant.html` (same)
- No Forgot? on sign-in. Do not build `forgot-password.html`.

**What they do**

- Staff open an owner or tenant who can already sign in, type a new password, and save. That person signs in with the new password.
- Empty password on save leaves the existing password alone.
- First grant (no login yet) stays [RIDGE-27](https://linear.app/dm-studios/issue/RIDGE-27/staff-can-give-an-owner-a-login) / [RIDGE-29](https://linear.app/dm-studios/issue/RIDGE-29/staff-can-give-a-tenant-a-login): email plus password still creates the account.

**How it is built**

- Staff-only actions that call Convex Auth `modifyAccountCredentials`, not a second `createAccount`.
- `owners.grantLogin` and `leases.grantLogin` stay first-grant only.
- Internal action `auth.setPassword` (email + new password) for a last remaining staff lockout. Run with `npx convex run`. Not callable from the website. Do not edit `authAccounts` in the Convex dashboard; the secret is hashed. Document the command in `docs/convex-auth-env.md`.
- Sign-up on sign-in stays refused.

**Acceptance (yes or no)**

- Staff set a new password on Kwesi (or another owner with a login). That owner signs in with the new password and not the old one.
- Same for a tenant who already has a login (Akosua or one staff granted).
- Saving edit owner / edit tenant with the password field empty does not change the password.
- A person who is not staff cannot set a password.
- Tests cover set on owner, set on tenant, and empty password leaves the secret alone.

**Out of scope**

- Forgot? / email reset ([RIDGE-28](https://linear.app/dm-studios/issue/RIDGE-28/a-person-can-reset-a-forgotten-password-from-sign-in) canceled).
- Adding office staff or setting a password on another staff login ([RIDGE-31](https://linear.app/dm-studios/issue/RIDGE-31/staff-can-add-another-office-person)).
- Field-worker password from the website.
- Changing a password while already signed in as that person.

---

## RIDGE-6. Tenant can file a repair with a photo and see status received

**Epic:** Work orders ([RIDGE-22](https://linear.app/dm-studios/issue/RIDGE-22/epic-work-orders))
**Apps:** web (tenant), Convex, Convex file storage
**Branch:** `feature/RIDGE-6`

A signed-in tenant on an active lease can submit a repair with an optional photo. The ticket starts at **received**. Staff see it on the right unit and building. The tenant can correct the typed description while status is still received.

**Design:**

- Tenant file repair: `docs/ui-design/ridgeway/exports/web/tenant/file-repair.html`
- Tenant repair timeline: `docs/ui-design/ridgeway/exports/web/tenant/repair-timeline.html`
- Tenant home (File a repair + open repairs only): `docs/ui-design/ridgeway/exports/web/tenant/home.html`
- Staff repair list: `docs/ui-design/ridgeway/exports/web/staff/repair-list.html`
- Staff repair detail: `docs/ui-design/ridgeway/exports/web/staff/repair-detail.html`

Phone file-repair is not this slice. Do not paste UX Pilot markup into the app.

**How it is built**

- `workOrders.createByTenant` creates the ticket at received and writes the first history row.
- Optional photo: `files.createUploadUrl` then `files.attachToWorkOrder` (`kind: "repair"`). Bytes go to Convex storage.
- Seed one current tenant (Akosua Darko on Ridge Court B12) so the journey can be clicked. Staff still cannot grant a login to any other tenant.

**Acceptance (yes or no)**

- A signed-in tenant on an active lease can submit a repair with optional photo.
- A work order row exists after refresh, status received.
- Staff can see that work order on the staff site against the right unit and building.
- Tests cover create and still there after reload.

**Out of scope**

- House-rules chat.
- Model-suggested category or urgency.
- Assign → scheduled → done ([RIDGE-7](https://linear.app/dm-studios/issue/RIDGE-7/field-worker-can-move-a-job-received-assigned-scheduled-done-and)).
- Staff granting tenant logins ([RIDGE-29](https://linear.app/dm-studios/issue/RIDGE-29/staff-can-give-a-tenant-a-login)).
- Ending a lease ([RIDGE-8](https://linear.app/dm-studios/issue/RIDGE-8/after-staff-end-a-lease-that-tenant-cannot-see-the-unit)).
- Fake rent on tenant home.

---

## RIDGE-29. Staff can give a tenant a login

**Epic:** Auth ([RIDGE-19](https://linear.app/dm-studios/issue/RIDGE-19/epic-auth))
**Apps:** web, Convex
**Branch:** `feature/RIDGE-29`

Staff can give a person a website login for a tenant who already has a lease. Same pattern as owner login ([RIDGE-27](https://linear.app/dm-studios/issue/RIDGE-27/staff-can-give-an-owner-a-login)): email and a temporary password on add tenant and on edit tenant. First grant only; no password reset.

RIDGE-6 seeds one tenant (Akosua) so that slice can be clicked. Staff still cannot grant a login to any other tenant until this ticket.

**Design:**

- Add tenant: `docs/ui-design/ridgeway/exports/web/staff/add-tenant.html` (same form in edit; password field added. No new screen.)

**Who gets a login**

- New tenant: staff may type email and a temporary password when they add the tenant. If they set a password, email is required and the login is created on that save.
- Existing tenant with no login: staff open edit tenant, type email and a temporary password, and save.
- Existing tenant who already has a login (including seed Akosua): the form shows they can sign in. Do not create a second account. Do not change the password.

**How it is built**

- Staff type email and password. `createAccount` cannot run inside `leases.create` or `leases.update`. Use a staff-callable action, then attach the Auth user to the existing tenant profile.
- No public sign-up. Sign-up on the sign-in screen stays refused.

**Rules**

- First grant only on this slice. Setting a new password is [RIDGE-30](https://linear.app/dm-studios/issue/RIDGE-30/staff-can-set-a-new-password-on-an-existing-owner-or-tenant-login).
- Contact email stays required for a tenant. Password is optional until they grant a login.
- Refuse the email if it already belongs to staff, field, an owner login, or another tenant login.

**Acceptance (yes or no)**

- Staff add a tenant with email and a temporary password. That person can sign in and file a repair on their current unit.
- Staff open a tenant who was saved earlier with no login, set a password, save. That person can sign in the same way.
- Staff open a tenant who already has a login. Save does not create another account and does not change the password.
- A person who is not staff cannot create a tenant account from sign-in.

**Out of scope**

- Field login.
- Setting a new password after the first grant ([RIDGE-30](https://linear.app/dm-studios/issue/RIDGE-30/staff-can-set-a-new-password-on-an-existing-owner-or-tenant-login)).
- Ending a lease ([RIDGE-8](https://linear.app/dm-studios/issue/RIDGE-8/after-staff-end-a-lease-that-tenant-cannot-see-the-unit)).

---

## RIDGE-31. Staff can add another office person

**Epic:** Auth ([RIDGE-19](https://linear.app/dm-studios/issue/RIDGE-19/epic-auth))
**Apps:** web, Convex
**Branch:** `feature/RIDGE-31`

Signed-in staff can add another office person (name, email, temporary password). That person can sign in on the staff website. Staff can later type a new password on that login. Ama exists today only because seed created her. There is no add-staff screen yet.

**Design:**

- Not locked. Reuse the add-owner / add-tenant form chrome: name, email, password, save. List of office people in the same staff site.
- Rebuild with this repo's components. Do not paste UX Pilot markup into the app.

**What they do**

- Staff add an office person with email and a temporary password. That person signs in and sees the staff website.
- Staff open an existing office person, type a new password, save. Empty password leaves the existing password alone.
- Staff cannot create a second login for someone who already has one.

**How it is built**

- Same `createAccount` pattern as [RIDGE-27](https://linear.app/dm-studios/issue/RIDGE-27/staff-can-give-an-owner-a-login) / [RIDGE-29](https://linear.app/dm-studios/issue/RIDGE-29/staff-can-give-a-tenant-a-login), then a staff membership (no `ownerId`).
- Setting a new password uses `modifyAccountCredentials` (same as [RIDGE-30](https://linear.app/dm-studios/issue/RIDGE-30/staff-can-set-a-new-password-on-an-existing-owner-or-tenant-login)).
- Refuse the email if it already belongs to staff, field, an owner login, or a tenant login.
- No public sign-up. Sign-up on sign-in stays refused.
- A last remaining staff lockout is still the Convex CLI `auth.setPassword` path, not this screen.

**Acceptance (yes or no)**

- Signed-in staff add another office person. That person signs in and sees staff screens.
- Staff set a new password on that person. The old password no longer works.
- The same email as Ama, Yaw, an owner, or a tenant is refused.
- A person who is not staff cannot add office staff.
- Tests cover create, set password, and refuse a taken email.

**Out of scope**

- Forgot-password email.
- An admin role or a god account in the app.
- Field-worker hire ([RIDGE-34](https://linear.app/dm-studios/issue/RIDGE-34/staff-can-add-a-field-worker-and-see-them-on-a-list)).
- Removing or suspending staff.

---

## RIDGE-32. Staff can see every tenant, with or without a current lease

**Epic:** Staff portfolio ([RIDGE-20](https://linear.app/dm-studios/issue/RIDGE-20/epic-staff-portfolio))
**Apps:** web, Convex
**Branch:** `feature/RIDGE-32`

Staff can open a tenant list on the staff site and see every tenant in their organization, including people with a current lease and people with no current lease. Today a tenant is only visible on a unit.

**Design:**

- Not locked. Reuse the building-list table chrome.
- Staff sidebar: add **Tenants** (Home, Buildings, Repairs stay).
- Columns that match data we already store: name, email, current building and unit (or none), whether they can sign in.
- Row opens the existing edit-tenant form.

**What they do**

- Staff open Tenants and see Akosua (current lease on Ridge Court · B12) without opening that unit.
- A tenant whose lease has ended still appears, with no current unit.
- Staff can open a row to correct details or (after [RIDGE-30](https://linear.app/dm-studios/issue/RIDGE-30/staff-can-set-a-new-password-on-an-existing-owner-or-tenant-login)) set a password.

**How it is built**

- Staff-only query listing tenant profiles in the caller's organization, each with the current lease if any. People with only ended leases still appear.
- Do not invent a tenant who never had a lease. New tenants are still created with a lease ([RIDGE-4](https://linear.app/dm-studios/issue/RIDGE-4/staff-can-add-an-owner-and-a-tenant-with-a-lease-that-already-started)).
- Wire real values. Do not hardcode `"—"` when a current unit or login already exists.

**Acceptance (yes or no)**

- Signed-in staff open Tenants and see every tenant without opening a building.
- A row with a current lease shows the building and unit.
- A row with no current lease shows none, and still lists the person.
- A person who is not staff cannot read the list.
- Tests cover current lease, no current lease, and staff-only.

**Out of scope**

- Owners list ([RIDGE-33](https://linear.app/dm-studios/issue/RIDGE-33/staff-can-see-every-owner-without-opening-a-building)).
- Office staff ([RIDGE-31](https://linear.app/dm-studios/issue/RIDGE-31/staff-can-add-another-office-person)).
- Field workers ([RIDGE-34](https://linear.app/dm-studios/issue/RIDGE-34/staff-can-add-a-field-worker-and-see-them-on-a-list)).
- Ending a lease ([RIDGE-8](https://linear.app/dm-studios/issue/RIDGE-8/after-staff-end-a-lease-that-tenant-cannot-see-the-unit)). A Convex test may end a lease to prove the empty-unit row.

---

## RIDGE-33. Staff can see every owner without opening a building

**Epic:** Staff portfolio ([RIDGE-20](https://linear.app/dm-studios/issue/RIDGE-20/epic-staff-portfolio))
**Apps:** web, Convex
**Branch:** `feature/RIDGE-33`

Staff can open an owner list and see every owner in their organization without opening a building. The buildings list already shows an owner name; this is the people list so staff can find Kwesi, see who has a login, and open edit.

**Design:**

- Not locked. Same table chrome as the tenant list / building list.
- Staff sidebar: add **Owners**.
- Columns that match data we already store: name, email, how many buildings, whether they can sign in.
- Row name (and the building count) opens that owner. Edit owner and the building list live there. Building names on that page open building detail.

**What they do**

- Staff open Owners and see Kwesi and Adwoa without opening Ridge Court or Labone.
- Staff open an owner and see every building linked to them. A building name opens building detail.
- Staff open Edit owner to correct details or (after [RIDGE-30](https://linear.app/dm-studios/issue/RIDGE-30/staff-can-set-a-new-password-on-an-existing-owner-or-tenant-login)) set a password.

**How it is built**

- `owners.listForStaff` already exists. Extend the row with login and building count if those are missing, then ship the screen.
- `owners.get` returns the buildings linked to that owner for the staff owner page.
- Wire real values. Do not hardcode `"—"` when a login or building already exists.

**Acceptance (yes or no)**

- Signed-in staff open Owners and see every owner in the organization.
- Each row shows name, contact, building count, and whether they can sign in.
- A person who is not staff cannot read the list.
- Tests cover the list and staff-only.

**Out of scope**

- Tenant list ([RIDGE-32](https://linear.app/dm-studios/issue/RIDGE-32/staff-can-see-every-tenant-with-or-without-a-current-lease)).
- Office staff ([RIDGE-31](https://linear.app/dm-studios/issue/RIDGE-31/staff-can-add-another-office-person)).
- Field workers ([RIDGE-34](https://linear.app/dm-studios/issue/RIDGE-34/staff-can-add-a-field-worker-and-see-them-on-a-list)).
- Occupancy, open issues, and rent on owner home ([RIDGE-11](https://linear.app/dm-studios/issue/RIDGE-11/owner-home-shows-occupancy-open-issues-and-rent-collected-versus)).

---

## RIDGE-34. Staff can add a field worker and see them on a list

**Epic:** Auth ([RIDGE-19](https://linear.app/dm-studios/issue/RIDGE-19/epic-auth))
**Apps:** web, Convex
**Branch:** `feature/RIDGE-34`

Signed-in staff add field workers (name, email, temporary password) and see every field worker in their organization. Seed Yaw is demo data only; hire is this screen, not seed. Do not put field workers on the tenant or owner lists.

**Design:**

- Not locked. Reuse add-owner / add-tenant form chrome and the people-list table.
- Staff sidebar: add **Field**.

**What they do**

- Staff add a caretaker with email and a temporary password. That person signs in on the field app.
- Staff open the field list, see Yaw and anyone they added, and can later set a new password (same pattern as [RIDGE-30](https://linear.app/dm-studios/issue/RIDGE-30/staff-can-set-a-new-password-on-an-existing-owner-or-tenant-login)).

**How it is built**

- Same `createAccount` pattern as owner and office staff, then a field membership.
- Refuse the email if it already belongs to staff, field, an owner login, or a tenant login.
- [RIDGE-7](https://linear.app/dm-studios/issue/RIDGE-7/field-worker-can-move-a-job-received-assigned-scheduled-done-and) assigns jobs after this ticket. Staff pick someone they hired (or seed Yaw).

**Acceptance (yes or no)**

- Signed-in staff add a field worker. That person can sign in as field, not staff.
- Staff see every field worker without opening a job.
- A taken email is refused.
- A person who is not staff cannot add or list field workers.
- Tests cover create, list, and refuse a taken email.

**Out of scope**

- Tenant list ([RIDGE-32](https://linear.app/dm-studios/issue/RIDGE-32/staff-can-see-every-tenant-with-or-without-a-current-lease)) and owner list ([RIDGE-33](https://linear.app/dm-studios/issue/RIDGE-33/staff-can-see-every-owner-without-opening-a-building)).
- Job assign → scheduled → done ([RIDGE-7](https://linear.app/dm-studios/issue/RIDGE-7/field-worker-can-move-a-job-received-assigned-scheduled-done-and)).
- Forgot-password email.
- Removing or suspending field workers.

---

## RIDGE-35. Field app: completion photo uploads on device, Android system bar, keyboard, and password visibility

**Epic:** Work orders ([RIDGE-22](https://linear.app/dm-studios/issue/RIDGE-22/epic-work-orders))
**Apps:** mobile
**Branch:** `feature/RIDGE-35`

Follow-up on [RIDGE-7](https://linear.app/dm-studios/issue/RIDGE-7/field-worker-can-move-a-job-received-assigned-scheduled-done-and). Preview on a real phone: completion photo save, Android system navigation bar, keyboard covering fields, password show/hide.

**What they do**

- A field worker can take or pick a completion photo on a preview install and save it. The job moves to done.
- Android with a system navigation bar (Galaxy A16 3-button / gesture pill) keeps tabs and primary buttons above that bar.
- On sign-in and any other typed field, the keyboard does not cover the field being edited.
- Password has a show/hide control, same idea as the website password field.
- Preview JS updates download and reload on launch, so the next `yarn update:preview` does not need a second force-quit.

**Out of scope**

- Tenant phone screens ([RIDGE-9](https://linear.app/dm-studios/issue/RIDGE-9/tenant-sees-a-rent-reminder-and-can-mark-a-payment-as-reported)).
- End lease ([RIDGE-8](https://linear.app/dm-studios/issue/RIDGE-8/after-staff-end-a-lease-that-tenant-cannot-see-the-unit)).

---

## RIDGE-9. Tenant sees a rent reminder and can mark a payment as reported

**Epic:** Rent status ([RIDGE-23](https://linear.app/dm-studios/issue/RIDGE-23/epic-rent-status))
**Apps:** web (tenant and staff), mobile (tenant), shared, convex
**Branch:** `feature/RIDGE-9`

A tenant on a current lease sees rent for their period and can mark a payment as reported. Staff confirm paid, late, or partial. The tenant report does not set paid. An ended lease does not show rent.

**Design:**

- Tenant rent (web): `docs/ui-design/ridgeway/exports/web/tenant/rent.html`
- Tenant rent (phone): `docs/ui-design/ridgeway/exports/mobile/tenant/rent.html`
- Staff rent list: `docs/ui-design/ridgeway/exports/web/staff/rent-list.html`

**What they do**

- Akosua sees September rent as late and taps I have paid. Status stays late until staff confirm.
- Ama opens Rent, picks Ridge Court, sees which tenants have reported a payment, and sets paid, not paid, or partial.
- After a lease ends, that tenant cannot read rent.

**How it is built**

- Convex `rentPeriods`. Queries `rent.listForCurrentTenant` and `rent.listByBuilding`. Mutations `rent.reportPaymentByTenant` (writes `tenantReportedAt` only) and `rent.setConfirmedStatus` (staff only).
- `getRentDisplayStatus` in `packages/shared` turns stored confirmed status plus due date and `serverNow` into paid, due, late, or partial. Unpaid before the due date is due, not late.
- The staff row shows the monthly amount, its due date, what a partial payment left owing, and a line naming the day the tenant reported paying. A Reported filter counts the claims still waiting on staff.
- Partial opens `ConfirmPartialRentModal` and staff type the amount received. `rent.setConfirmedStatus` refuses zero or the full rent.
- Seed writes July and August paid and September unpaid for Akosua. New leases do not get periods until a later seed.

**Acceptance (yes or no)**

- A tenant on a current lease sees a rent reminder for their period.
- That tenant can mark a payment as reported. The report does not set paid by itself.
- Staff can set confirmed status to paid, not paid, or partial, and a partial payment records the amount staff actually received. Only staff write confirmedStatus.
- Staff can see on the rent list which tenants have reported a payment and when.
- An ended lease must not show rent to that tenant.
- Tests cover tenant report vs staff confirm, and an ended lease refusing rent reads.

**Out of scope**

- Full accounts ledger, payroll, or bank connection.
- Owner collected versus outstanding ([RIDGE-11](https://linear.app/dm-studios/issue/RIDGE-11/owner-home-shows-occupancy-open-issues-and-rent-collected-versus)).
- Staff command center ([RIDGE-10](https://linear.app/dm-studios/issue/RIDGE-10/staff-command-center-shows-open-work-orders-and-rent-status-across)).
- Accra world seed of thirty days of rent ([RIDGE-12](https://linear.app/dm-studios/issue/RIDGE-12/seed-accra-world-ten-buildings-three-owners-thirty-days-of-rent-and)).
- Rent stored on the lease ([RIDGE-36](https://linear.app/dm-studios/issue/RIDGE-36/rent-amount-and-due-day-live-on-the-lease)), monthly charging ([RIDGE-37](https://linear.app/dm-studios/issue/RIDGE-37/every-current-lease-is-charged-rent-each-month)), and past months with arrears ([RIDGE-38](https://linear.app/dm-studios/issue/RIDGE-38/staff-can-open-an-earlier-month-and-see-what-a-tenant-still-owes)).

---

## RIDGE-36. Rent amount and due day live on the lease

**Epic:** Rent status ([RIDGE-23](https://linear.app/dm-studios/issue/RIDGE-23/epic-rent-status))
**Apps:** web (staff), convex, shared
**Branch:** `feature/RIDGE-36`

Today a rent amount only exists on a `rentPeriods` row, copied from a constant in `convex/seed.ts`. Nothing records what a unit actually rents for, so staff cannot set rent when they put a tenant on a unit and cannot change it later.

**What they do**

- Ama adds a tenant to a unit and enters the monthly rent and the day it is due.
- Ama opens an existing lease and corrects the rent when it changes.

**How it is built**

- Add `rentAmount`, `rentCurrency`, and `rentDueDay` to `leases`. Money stays whole pesewas.
- Extend the add-unit and add-tenant lease forms and the staff mutations that create a lease.
- A lease with no rent set keeps working and reads as not set.

**Acceptance (yes or no)**

- Staff set a monthly rent and due day when creating a lease, and see it back.
- Staff change the rent on an existing lease.
- A lease with no rent set does not break the rent screens.
- Tests cover create with rent, change rent, and a lease with no rent.

**Out of scope**

- Ledger, deposits, late fees, pro-rata first months.
- Generating rent periods ([RIDGE-37](https://linear.app/dm-studios/issue/RIDGE-37/every-current-lease-is-charged-rent-each-month)).

---

## RIDGE-37. Every current lease is charged rent each month

**Epic:** Rent status ([RIDGE-23](https://linear.app/dm-studios/issue/RIDGE-23/epic-rent-status))
**Apps:** convex
**Branch:** `feature/RIDGE-37`
**Blocked by:** [RIDGE-36](https://linear.app/dm-studios/issue/RIDGE-36/rent-amount-and-due-day-live-on-the-lease)

Rent periods only exist because `seed.ensureRentPeriods` inserts three hardcoded months for one lease. Nothing creates next month, so on the first of a new month the staff rent page is empty for every building.

**What they do**

- A new month begins and every current lease already has an unpaid rent row due on the lease's due day.
- Ama adds a tenant mid-month and that lease appears on the rent page without anyone running a script.

**How it is built**

- One internal mutation that charges a given month for every current lease that does not already have a row. Running it twice must not double-charge.
- A Convex cron runs it at the start of each month. Creating a lease charges the current month straight away.
- Amount, currency, and due day come from the lease. A lease with no rent set is skipped.

**Acceptance (yes or no)**

- Running the month job creates exactly one unpaid row per current lease.
- Running it a second time changes nothing.
- An ended lease is not charged for a month after it ended.
- A lease with no rent amount is skipped rather than charged zero.
- Tests cover first run, repeat run, ended lease, and no rent set.

**Out of scope**

- Back-filling months before the lease started.
- Changing `confirmedStatus` on rows that already exist.

---

## RIDGE-38. Staff can open an earlier month and see what a tenant still owes

**Epic:** Rent status ([RIDGE-23](https://linear.app/dm-studios/issue/RIDGE-23/epic-rent-status))
**Apps:** web (staff), convex
**Branch:** `feature/RIDGE-38`
**Blocked by:** [RIDGE-37](https://linear.app/dm-studios/issue/RIDGE-37/every-current-lease-is-charged-rent-each-month)

`rent.listByBuilding` computes the current month from `Date.now()` and drops every other row. Staff cannot open August, and Collected and Outstanding only ever describe this month. If a tenant does not pay September, the row disappears on 1 October.

**What they do**

- Ama steps back to August and sees who paid and who did not.
- Ama sees what a tenant owes in total, not only this month's charge.

**How it is built**

- `rent.listByBuilding` takes an optional month and defaults to the current one.
- Month navigation on the staff rent page, back to the earliest charged month and never into the future.
- Each row shows arrears carried from earlier months alongside this month's charge.

**Acceptance (yes or no)**

- Staff open a past month and see that month's rows and totals.
- Staff cannot navigate past the earliest charged month or into a future month.
- A tenant with an unpaid earlier month shows arrears on the current month.
- Confirming a status while viewing a past month writes to that month's row.
- Tests cover a past month, the totals following the month, and arrears on the current month.

**Out of scope**

- Per-tenant statement or downloadable report.
- Late fees or interest.

---

## Next slices

19. [RIDGE-10 Staff command center](https://linear.app/dm-studios/issue/RIDGE-10/staff-command-center-shows-open-work-orders-and-rent-status-across) — Design: `exports/web/staff/home.html`.
20. [RIDGE-11 Owner home](https://linear.app/dm-studios/issue/RIDGE-11/owner-home-shows-occupancy-open-issues-and-rent-collected-versus) — Design: `exports/web/owner/home.html`.
21. [RIDGE-12 Seed Accra world](https://linear.app/dm-studios/issue/RIDGE-12/seed-accra-world-ten-buildings-three-owners-thirty-days-of-rent-and) — Ten buildings, three owners, no user named "test user".
22. [RIDGE-13 Empty, loading, error, and no-permission states](https://linear.app/dm-studios/issue/RIDGE-13/empty-loading-error-and-no-permission-states-on-shipped-screens) — Design: `exports/web/staff/empty-list.html`, `loading.html`, `failed-to-load.html`, `not-allowed.html`.
23. [RIDGE-14 TestFlight submit](https://linear.app/dm-studios/issue/RIDGE-14/testflight-submit-of-the-tenant-and-field-app) — Launch project.
24. [RIDGE-15 Play internal or closed test](https://linear.app/dm-studios/issue/RIDGE-15/play-internal-or-closed-test-upload-of-the-tenant-and-field-app) — Launch project.

---

## After 1 through 21

24. [RIDGE-16 House-rules chat](https://linear.app/dm-studios/issue/RIDGE-16/tenant-or-staff-can-ask-a-house-rules-question-and-get-an-answer-from)
25. [RIDGE-17 Suggested category and urgency](https://linear.app/dm-studios/issue/RIDGE-17/filing-a-repair-may-suggest-a-category-and-urgency-that-a-person-can) — Reuse the File a repair selects. No extra screen.
26. [RIDGE-18 Monthly owner summary draft](https://linear.app/dm-studios/issue/RIDGE-18/staff-can-generate-a-plain-language-monthly-owner-summary-and-edit-it)
27. [RIDGE-26 Staff can remove a mistaken building or unit that has no lease or repair](https://linear.app/dm-studios/issue/RIDGE-26/staff-can-remove-a-mistaken-building-or-unit-that-has-no-lease-or) — Staff portfolio. Design not locked. Work orders, rent, and leases stay undeletable.

---

## Related docs

- [Product requirements](./product-requirements.md)
- [System design](./system-design.md)
- [Convex design](./convex-design.md)
- [Convex Auth env](../convex-auth-env.md)
- [Screen design](../ui-design/ridgeway/README.md)
