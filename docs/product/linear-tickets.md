# Linear tickets — Ridgeway

Build order for this product. Issues live on Linear team [Ridgeway](https://linear.app/dm-studios/team/RIDGE) (`RIDGE`). Assigned to Delasi Mensah.

Projects:

- [First Version](https://linear.app/dm-studios/project/first-version-2e4b841a6448) — product slices
- [Launch](https://linear.app/dm-studios/project/launch-10a9121e69b0) — TestFlight and Play

Screen HTML lives in `docs/ui-design/ridgeway/exports/`. Each issue body links the exports for that journey. Rebuild with this repo's components. Do not paste UX Pilot markup into the app.

Implement one issue at a time. Branch `feature/RIDGE-n`. Product schema and Convex functions start with [RIDGE-1](https://linear.app/dm-studios/issue/RIDGE-1/staff-can-sign-in-on-the-website).

---

## Status now

- [RIDGE-1](https://linear.app/dm-studios/issue/RIDGE-1/staff-can-sign-in-on-the-website) is **Todo**. Everything else is **Backlog**.
- Do not move an issue to In Progress without the Design block in Linear.
- RIDGE-16, RIDGE-17, and RIDGE-18 wait until RIDGE-1 through RIDGE-13 are done.

---

## Epics

Parent issues. Children sit under them.

- [RIDGE-19 Auth](https://linear.app/dm-studios/issue/RIDGE-19/epic-auth) — sign in, roles, sign out
- [RIDGE-20 Staff portfolio](https://linear.app/dm-studios/issue/RIDGE-20/epic-staff-portfolio) — command center, add building, unit, owner, tenant, end lease
- [RIDGE-21 Owner isolation](https://linear.app/dm-studios/issue/RIDGE-21/epic-owner-isolation) — an owner sees only their buildings
- [RIDGE-22 Work orders](https://linear.app/dm-studios/issue/RIDGE-22/epic-work-orders) — tenant files a repair, field update, photos
- [RIDGE-23 Rent status](https://linear.app/dm-studios/issue/RIDGE-23/epic-rent-status) — paid, late, or partial; tenant reported payment
- [RIDGE-24 Launch](https://linear.app/dm-studios/issue/RIDGE-24/epic-launch) — seed look, empty states, TestFlight, Play

---

## First slices (a person can tap these)

1. [RIDGE-1 Staff can sign in on the website](https://linear.app/dm-studios/issue/RIDGE-1/staff-can-sign-in-on-the-website) — Auth. Web. Also Vitest for `convex/` and `convex-helpers` wrappers. Design: `exports/web/staff/sign-in.html`.
2. [RIDGE-2 Staff can add one building and see it in a list](https://linear.app/dm-studios/issue/RIDGE-2/staff-can-add-one-building-and-see-it-in-a-list) — Staff portfolio. Design: `exports/web/staff/building-list.html`, `add-building.html`.
3. [RIDGE-3 Staff can add a unit under a building](https://linear.app/dm-studios/issue/RIDGE-3/staff-can-add-a-unit-under-a-building) — Staff portfolio. Design: `exports/web/staff/building-detail.html`, `add-unit.html`.
4. [RIDGE-4 Staff can add an owner and a tenant with a lease that already started](https://linear.app/dm-studios/issue/RIDGE-4/staff-can-add-an-owner-and-a-tenant-with-a-lease-that-already-started) — Staff portfolio. Design: `exports/web/staff/add-owner.html`, `add-tenant.html`.
5. [RIDGE-5 Owner A cannot see Owner B's buildings](https://linear.app/dm-studios/issue/RIDGE-5/owner-a-cannot-see-owner-bs-buildings) — Owner isolation. Design: `exports/web/owner/home.html`. Integration tests on Convex functions.
6. [RIDGE-6 Tenant can file a repair with a photo and see status received](https://linear.app/dm-studios/issue/RIDGE-6/tenant-can-file-a-repair-with-a-photo-and-see-status-received) — Work orders. Design: `exports/web/tenant/file-repair.html`.
7. [RIDGE-7 Field worker can move a job received → assigned → scheduled → done and attach a completion photo](https://linear.app/dm-studios/issue/RIDGE-7/field-worker-can-move-a-job-received-assigned-scheduled-done-and) — Work orders. Design: `exports/mobile/field/job-detail.html`.
8. [RIDGE-8 After staff end a lease, that tenant cannot see the unit](https://linear.app/dm-studios/issue/RIDGE-8/after-staff-end-a-lease-that-tenant-cannot-see-the-unit) — Staff portfolio. Design: `exports/web/staff/end-lease.html`, `exports/web/tenant/lease-ended.html`.

---

## Next slices

9. [RIDGE-9 Tenant sees a rent reminder and can mark a payment as reported](https://linear.app/dm-studios/issue/RIDGE-9/tenant-sees-a-rent-reminder-and-can-mark-a-payment-as-reported) — Rent. Design: `exports/web/tenant/rent.html`, `exports/web/staff/rent-list.html`.
10. [RIDGE-10 Staff command center](https://linear.app/dm-studios/issue/RIDGE-10/staff-command-center-shows-open-work-orders-and-rent-status-across) — Design: `exports/web/staff/home.html`.
11. [RIDGE-11 Owner home](https://linear.app/dm-studios/issue/RIDGE-11/owner-home-shows-occupancy-open-issues-and-rent-collected-versus) — Design: `exports/web/owner/home.html`.
12. [RIDGE-12 Seed Accra world](https://linear.app/dm-studios/issue/RIDGE-12/seed-accra-world-ten-buildings-three-owners-thirty-days-of-rent-and) — Ten buildings, three owners, no user named "test user".
13. [RIDGE-13 Empty, loading, error, and no-permission states](https://linear.app/dm-studios/issue/RIDGE-13/empty-loading-error-and-no-permission-states-on-shipped-screens) — Design: `exports/web/staff/empty-list.html`, `loading.html`, `failed-to-load.html`, `not-allowed.html`.
14. [RIDGE-14 TestFlight submit](https://linear.app/dm-studios/issue/RIDGE-14/testflight-submit-of-the-tenant-and-field-app) — Launch project.
15. [RIDGE-15 Play internal or closed test](https://linear.app/dm-studios/issue/RIDGE-15/play-internal-or-closed-test-upload-of-the-tenant-and-field-app) — Launch project.

---

## After 1 through 13

16. [RIDGE-16 House-rules chat](https://linear.app/dm-studios/issue/RIDGE-16/tenant-or-staff-can-ask-a-house-rules-question-and-get-an-answer-from)
17. [RIDGE-17 Suggested category and urgency](https://linear.app/dm-studios/issue/RIDGE-17/filing-a-repair-may-suggest-a-category-and-urgency-that-a-person-can) — Reuse the File a repair selects. No extra screen.
18. [RIDGE-18 Monthly owner summary draft](https://linear.app/dm-studios/issue/RIDGE-18/staff-can-generate-a-plain-language-monthly-owner-summary-and-edit-it)

---

## Related docs

- [Product requirements](./product-requirements.md)
- [System design](./system-design.md)
- [Convex design](./convex-design.md)
- [Screen design](../ui-design/ridgeway/README.md)
