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
- [RIDGE-28](https://linear.app/dm-studios/issue/RIDGE-28/a-person-can-reset-a-forgotten-password-from-sign-in) is **Todo** (forgot password from sign-in).
- Next slice is [RIDGE-7](https://linear.app/dm-studios/issue/RIDGE-7/field-worker-can-move-a-job-received-assigned-scheduled-done-and) (field worker can move a job received → assigned → scheduled → done).
- RIDGE-8 through RIDGE-15, RIDGE-28, and the epics are **Todo**.
- RIDGE-16, RIDGE-17, RIDGE-18, and RIDGE-26 stay **Backlog** until RIDGE-1 through RIDGE-13 are done.

When a slice is started, move that issue to In Progress immediately. Do not use Backlog for queued first-version work. Linear stays In Progress until merge to `main`. In the feature PR, write this Status now block as that post-merge board.

---

## Epics

Parent issues. Children sit under them.

- [RIDGE-19 Auth](https://linear.app/dm-studios/issue/RIDGE-19/epic-auth) — sign in, roles, sign out
- [RIDGE-20 Staff portfolio](https://linear.app/dm-studios/issue/RIDGE-20/epic-staff-portfolio) — command center, add and correct building, unit, owner, tenant, end lease
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
7. [RIDGE-27 Staff can give an owner a login](https://linear.app/dm-studios/issue/RIDGE-27/staff-can-give-an-owner-a-login) — Auth. New owners and owners already saved. Email and a temporary password on add owner and on edit owner. Convex `createAccount` (staff action) plus owner membership. First grant only; no password reset. Tenant and field logins are not this ticket. Design: `exports/web/staff/add-owner.html` (same form in edit; no new screen). Full text in **RIDGE-27** below.
8. [RIDGE-28 A person can reset a forgotten password from sign-in](https://linear.app/dm-studios/issue/RIDGE-28/a-person-can-reset-a-forgotten-password-from-sign-in) — Auth. Forgot? on sign-in, email reset link. Staff, owner, and tenant. Staff still cannot type a new password on edit owner. Design: `exports/web/staff/sign-in.html`, `forgot-password.html`. Full text in **RIDGE-28** below.
9. [RIDGE-6 Tenant can file a repair with a photo and see status received](https://linear.app/dm-studios/issue/RIDGE-6/tenant-can-file-a-repair-with-a-photo-and-see-status-received) — Work orders. Design: `exports/web/tenant/file-repair.html`. Includes correcting the typed description while the ticket is still received. Full text in **RIDGE-6** below.
10. [RIDGE-29 Staff can give a tenant a login](https://linear.app/dm-studios/issue/RIDGE-29/staff-can-give-a-tenant-a-login) — Auth. Same pattern as owner login. Email and a temporary password on add tenant and edit tenant. First grant only. Design: `exports/web/staff/add-tenant.html`. Full text in **RIDGE-29** below.
11. [RIDGE-7 Field worker can move a job received → assigned → scheduled → done and attach a completion photo](https://linear.app/dm-studios/issue/RIDGE-7/field-worker-can-move-a-job-received-assigned-scheduled-done-and) — Work orders. Design: `exports/mobile/field/job-detail.html`.
12. [RIDGE-8 After staff end a lease, that tenant cannot see the unit](https://linear.app/dm-studios/issue/RIDGE-8/after-staff-end-a-lease-that-tenant-cannot-see-the-unit) — Staff portfolio. Design: `exports/web/staff/end-lease.html`, `exports/web/tenant/lease-ended.html`.

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
- Forgot password, email reset, or changing a password after the first grant.
- Occupancy, open issues, and rent on owner home (RIDGE-11).

---

## RIDGE-28. A person can reset a forgotten password from sign-in

**Epic:** Auth ([RIDGE-19](https://linear.app/dm-studios/issue/RIDGE-19/epic-auth))
**Apps:** web, Convex

A person who already has a website login (staff, owner, or tenant) can get back in when they forget the password. Staff cannot type a new password on edit owner. That is first grant only ([RIDGE-27](https://linear.app/dm-studios/issue/RIDGE-27/staff-can-give-an-owner-a-login)).

**Design:**

- Sign in: `docs/ui-design/ridgeway/exports/web/staff/sign-in.html` (Forgot? in the password row)
- Reset: `docs/ui-design/ridgeway/exports/web/staff/forgot-password.html`
- Phone (same journey, later if not this slice): `docs/ui-design/ridgeway/exports/mobile/tenant/forgot-password.html`

**What they do**

- From sign in, they tap Forgot?, type their email, and send a reset link.
- The email and the link are how they set a new password. Staff do not invent a second password on the owner form.
- Same path for Ama, Kwesi, Adwoa, and a tenant who already has a login.

**How it is built**

- Convex Auth password reset (email link), not a staff mutation that overwrites the secret.
- The sign-in screen already exists. Add the Forgot? link and the reset screen.
- Do not enable public sign-up. Sign-up on sign-in stays refused.

**Acceptance (yes or no)**

- An owner who can sign in taps Forgot?, uses the email they were given, and can sign in with a new password.
- Staff and a tenant with a login can do the same.
- A mistyped or unknown email does not reveal whether that account exists.
- Edit owner still does not change a password.

**Out of scope**

- Staff typing a new password on add/edit owner.
- Field-app forgot password (unless the web path is already shared).
- Changing a password while already signed in.

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

- First grant only. Forgot password is [RIDGE-28](https://linear.app/dm-studios/issue/RIDGE-28/a-person-can-reset-a-forgotten-password-from-sign-in).
- Contact email stays required for a tenant. Password is optional until they grant a login.
- Refuse the email if it already belongs to staff, field, an owner login, or another tenant login.

**Acceptance (yes or no)**

- Staff add a tenant with email and a temporary password. That person can sign in and file a repair on their current unit.
- Staff open a tenant who was saved earlier with no login, set a password, save. That person can sign in the same way.
- Staff open a tenant who already has a login. Save does not create another account and does not change the password.
- A person who is not staff cannot create a tenant account from sign-in.

**Out of scope**

- Field login.
- Forgot password ([RIDGE-28](https://linear.app/dm-studios/issue/RIDGE-28/a-person-can-reset-a-forgotten-password-from-sign-in)).
- Ending a lease ([RIDGE-8](https://linear.app/dm-studios/issue/RIDGE-8/after-staff-end-a-lease-that-tenant-cannot-see-the-unit)).

---

## Next slices

13. [RIDGE-9 Tenant sees a rent reminder and can mark a payment as reported](https://linear.app/dm-studios/issue/RIDGE-9/tenant-sees-a-rent-reminder-and-can-mark-a-payment-as-reported) — Rent. Design: `exports/web/tenant/rent.html`, `exports/web/staff/rent-list.html`.
14. [RIDGE-10 Staff command center](https://linear.app/dm-studios/issue/RIDGE-10/staff-command-center-shows-open-work-orders-and-rent-status-across) — Design: `exports/web/staff/home.html`.
15. [RIDGE-11 Owner home](https://linear.app/dm-studios/issue/RIDGE-11/owner-home-shows-occupancy-open-issues-and-rent-collected-versus) — Design: `exports/web/owner/home.html`.
16. [RIDGE-12 Seed Accra world](https://linear.app/dm-studios/issue/RIDGE-12/seed-accra-world-ten-buildings-three-owners-thirty-days-of-rent-and) — Ten buildings, three owners, no user named "test user".
17. [RIDGE-13 Empty, loading, error, and no-permission states](https://linear.app/dm-studios/issue/RIDGE-13/empty-loading-error-and-no-permission-states-on-shipped-screens) — Design: `exports/web/staff/empty-list.html`, `loading.html`, `failed-to-load.html`, `not-allowed.html`.
18. [RIDGE-14 TestFlight submit](https://linear.app/dm-studios/issue/RIDGE-14/testflight-submit-of-the-tenant-and-field-app) — Launch project.
19. [RIDGE-15 Play internal or closed test](https://linear.app/dm-studios/issue/RIDGE-15/play-internal-or-closed-test-upload-of-the-tenant-and-field-app) — Launch project.

---

## After 1 through 13

20. [RIDGE-16 House-rules chat](https://linear.app/dm-studios/issue/RIDGE-16/tenant-or-staff-can-ask-a-house-rules-question-and-get-an-answer-from)
21. [RIDGE-17 Suggested category and urgency](https://linear.app/dm-studios/issue/RIDGE-17/filing-a-repair-may-suggest-a-category-and-urgency-that-a-person-can) — Reuse the File a repair selects. No extra screen.
22. [RIDGE-18 Monthly owner summary draft](https://linear.app/dm-studios/issue/RIDGE-18/staff-can-generate-a-plain-language-monthly-owner-summary-and-edit-it)
23. [RIDGE-26 Staff can remove a mistaken building or unit that has no lease or repair](https://linear.app/dm-studios/issue/RIDGE-26/staff-can-remove-a-mistaken-building-or-unit-that-has-no-lease-or) — Staff portfolio. Design not locked. Work orders, rent, and leases stay undeletable.

---

## Related docs

- [Product requirements](./product-requirements.md)
- [System design](./system-design.md)
- [Convex design](./convex-design.md)
- [Screen design](../ui-design/ridgeway/README.md)
