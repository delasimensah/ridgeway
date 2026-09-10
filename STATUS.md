# Project status (read this first)

**For agents and humans:** this is the handoff checklist for this job. Update it when a phase finishes or the “next” item changes. Code alone does not show workshop vs product phase. On a feature branch, write Snapshot and Next action as they should read after that pull request merges.

**Do not put secrets here.** URLs and “done” notes are fine. Passwords, webhook values, `.p8` paths, and deploy keys stay in `ACCESS-LIST.md` (gitignored) or vendor dashboards.

---

## Snapshot

- **Client / job:** Ridgeway Property Group (practice). Outcome B (apps on studio accounts).
- **Backend:** Convex
- **Current phase:** Build slices — **RIDGE-6 done** (tenant can file a repair with a photo). Next is [RIDGE-29](https://linear.app/dm-studios/issue/RIDGE-29/staff-can-give-a-tenant-a-login) (staff can give a tenant a login). [RIDGE-28](https://linear.app/dm-studios/issue/RIDGE-28/a-person-can-reset-a-forgotten-password-from-sign-in) is Todo (forgot password from sign-in).
- **Last updated:** 10 Sep 2026
- **Blocked / open:** none

---

## Before invoice 1 (sales / discovery)

- [x] First contact / discovery / recap (practice pack 01)
- [x] Questionnaire (02)
- [x] Product requirements locked (03) — in repo under `docs/product/`
- [x] Proposal, deal, invoice 1 simulated paid (04)

---

## Workshop (after invoice 1) — tools, not product features

- [x] Scaffold client monorepo from product document
- [x] Private GitHub repo (`delasimensah/ridgeway`)
- [x] Linear team `RIDGE` + project First Version + GitHub connection
- [x] Vercel project (web), production deploy, preview env
- [x] Expo / EAS project (`dm-studios` / `ridgeway`), `app.config.ts` owner + projectId + variants
- [x] Slack channel + GitHub / Linear / Vercel (EAS Slack webhook for preview cooks)
- [x] Convex cloud project (thin `convex/`, no product tables yet)
- [x] Local env: root `CONVEX_*`; web `NEXT_PUBLIC_CONVEX_URL`; mobile `EXPO_PUBLIC_CONVEX_URL`
- [x] Vercel + EAS preview: public Convex URL
- [x] Access list (`ACCESS-LIST.md`, gitignored)
- [x] Preview workflow (`.eas/workflows/preview.yml`) + `yarn workflow:preview`
- [x] iOS non-interactive cook path: ASC API key on EAS + `EXPO_APPLE_TEAM_ID` / `EXPO_APPLE_TEAM_TYPE` on preview
- [x] Preview workflow iOS succeeded (ad hoc refresh path)

**Not in workshop (later):** App Store Connect app, Play Console app, production Convex URL on Vercel Production if separate, store submit.

---

## Product path (after workshop)

- [x] System design (tables, permissions, risks) — `docs/product/system-design.md` and `docs/product/convex-design.md`. Product schema grows on the linked Convex project from here.
- [x] Screen design / UX Pilot exports (07) — `docs/ui-design/ridgeway/` (design system, reference map, prompts, HTML exports)
- [x] Linear build tickets with design links (08) — `docs/product/linear-tickets.md`. Team [RIDGE](https://linear.app/dm-studios/team/RIDGE). RIDGE-1, RIDGE-2, RIDGE-25, RIDGE-3, RIDGE-4, RIDGE-5, RIDGE-27, and RIDGE-6 Done; next is RIDGE-29 (staff can give a tenant a login); RIDGE-28 (forgot password) Todo; then RIDGE-7–15 and epics Todo; RIDGE-16–18 and RIDGE-26 Backlog. Launch project for TestFlight / Play.
- [ ] Build slices, demos, TestFlight / Play testing (09)
- [ ] Launch / walk-away notes (10)
- [ ] Evidence log paragraphs as phases lock

---

## Next action (one line)

Start [RIDGE-29](https://linear.app/dm-studios/issue/RIDGE-29/staff-can-give-a-tenant-a-login) (staff can give a tenant a login).

---

## Pointers

- RIDGE-1 PR (merged): https://github.com/delasimensah/ridgeway/pull/1
- RIDGE-2 PR (merged): https://github.com/delasimensah/ridgeway/pull/2
- RIDGE-25 PR (merged): https://github.com/delasimensah/ridgeway/pull/3
- RIDGE-3 PR (merged): https://github.com/delasimensah/ridgeway/pull/4
- RIDGE-4 PR (merged): https://github.com/delasimensah/ridgeway/pull/5
- RIDGE-5 PR (merged): https://github.com/delasimensah/ridgeway/pull/6
- RIDGE-27 PR: https://github.com/delasimensah/ridgeway/pull/8
- Product requirements: `docs/product/product-requirements.md`
- Linear tickets: `docs/product/linear-tickets.md`
- Screen design: `docs/ui-design/ridgeway/`
- Access list (private): `ACCESS-LIST.md`
- Practice pack (process paper): `project-template/docs/client-delivery/practice/ridgeway/`
- Convex cloud guide: `project-template/docs/client-delivery/convex-cloud-setup.md`
- Expo preview / ASC / Team ID: `project-template/docs/client-delivery/expo-preview-builds-and-slack.md`
