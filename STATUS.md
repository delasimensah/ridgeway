# Project status (read this first)

**For agents and humans:** this is the handoff checklist for this job. Update it when a phase finishes or the “next” item changes. Code alone does not show workshop vs product phase. On a feature branch, write Snapshot and Next action as they should read after that pull request merges.

**Do not put secrets here.** URLs and “done” notes are fine. Passwords, webhook values, `.p8` paths, and deploy keys stay in `ACCESS-LIST.md` (gitignored) or vendor dashboards.

---

## Snapshot

- **Client / job:** Ridgeway Property Group (practice). Outcome B (apps on studio accounts).
- **Backend:** Convex
- **Current phase:** Build slices — **RIDGE-42 done** (tenant rent shows received and still owed on a partial). Next is [RIDGE-43](https://linear.app/dm-studios/issue/RIDGE-43/phone-loading-skeletons-match-the-screen-they-stand-in-for). [RIDGE-12](https://linear.app/dm-studios/issue/RIDGE-12/seed-accra-world-ten-buildings-three-owners-two-years-of-rent-and) is **Done**. [RIDGE-13](https://linear.app/dm-studios/issue/RIDGE-13/empty-loading-error-and-no-permission-states-on-shipped-screens) is **Done**. [RIDGE-39](https://linear.app/dm-studios/issue/RIDGE-39/tenant-can-file-a-repair-with-a-photo-and-see-the-timeline-on-the) is **Done**. [RIDGE-28](https://linear.app/dm-studios/issue/RIDGE-28/a-person-can-reset-a-forgotten-password-from-sign-in) is Canceled.
- **Last updated:** 15 Sep 2026
- **Blocked / open:** None for TestFlight after the Accra world seed.

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
- [x] Linear build tickets with design links (08) — `docs/product/linear-tickets.md`. Team [RIDGE](https://linear.app/dm-studios/team/RIDGE). RIDGE-1, RIDGE-2, RIDGE-25, RIDGE-3, RIDGE-4, RIDGE-5, RIDGE-27, RIDGE-6, RIDGE-29, RIDGE-30, RIDGE-32, RIDGE-33, RIDGE-31, RIDGE-34, RIDGE-7, RIDGE-35, RIDGE-8, RIDGE-9, RIDGE-36, RIDGE-37, RIDGE-38, RIDGE-10, RIDGE-11, RIDGE-39, RIDGE-13, RIDGE-12, RIDGE-40, RIDGE-41, RIDGE-44, and RIDGE-42 Done; next is RIDGE-43; RIDGE-28 Canceled; RIDGE-19 through RIDGE-23 Done; RIDGE-24 Todo; RIDGE-15 Todo; RIDGE-16–18 and RIDGE-26 Backlog. Launch project for TestFlight / Play.
- [ ] Build slices, demos, TestFlight / Play testing (09)
- [ ] Launch / walk-away notes (10)
- [ ] Evidence log paragraphs as phases lock

---

## Next action (one line)

Start [RIDGE-43](https://linear.app/dm-studios/issue/RIDGE-43/phone-loading-skeletons-match-the-screen-they-stand-in-for) (phone loading skeletons match the screen they stand in for). Then [RIDGE-14](https://linear.app/dm-studios/issue/RIDGE-14/testflight-submit-of-the-tenant-and-field-app).

---

## Pointers

- RIDGE-1 PR (merged): https://github.com/delasimensah/ridgeway/pull/1
- RIDGE-2 PR (merged): https://github.com/delasimensah/ridgeway/pull/2
- RIDGE-25 PR (merged): https://github.com/delasimensah/ridgeway/pull/3
- RIDGE-3 PR (merged): https://github.com/delasimensah/ridgeway/pull/4
- RIDGE-4 PR (merged): https://github.com/delasimensah/ridgeway/pull/5
- RIDGE-5 PR (merged): https://github.com/delasimensah/ridgeway/pull/6
- RIDGE-27 PR (merged): https://github.com/delasimensah/ridgeway/pull/8
- RIDGE-6 PR (merged): https://github.com/delasimensah/ridgeway/pull/9
- RIDGE-29 PR (merged): https://github.com/delasimensah/ridgeway/pull/10
- RIDGE-30 PR (merged): https://github.com/delasimensah/ridgeway/pull/11
- RIDGE-32 PR (merged): https://github.com/delasimensah/ridgeway/pull/12
- RIDGE-33 PR (merged): https://github.com/delasimensah/ridgeway/pull/13
- RIDGE-31 PR (merged): https://github.com/delasimensah/ridgeway/pull/14
- RIDGE-34 PR (merged): https://github.com/delasimensah/ridgeway/pull/15
- RIDGE-34 follow-up PR (merged): https://github.com/delasimensah/ridgeway/pull/16
- RIDGE-7 PR (merged): https://github.com/delasimensah/ridgeway/pull/17
- RIDGE-35 PR (merged): https://github.com/delasimensah/ridgeway/pull/18
- RIDGE-8 PR (merged): https://github.com/delasimensah/ridgeway/pull/19
- RIDGE-9 PR (merged): https://github.com/delasimensah/ridgeway/pull/20
- RIDGE-36 PR (merged): https://github.com/delasimensah/ridgeway/pull/21
- RIDGE-37 PR (merged): https://github.com/delasimensah/ridgeway/pull/22
- RIDGE-38 PR (merged): https://github.com/delasimensah/ridgeway/pull/23
- RIDGE-10 PR (merged): https://github.com/delasimensah/ridgeway/pull/24
- RIDGE-11 PR (merged): https://github.com/delasimensah/ridgeway/pull/25
- RIDGE-39 PR (merged): https://github.com/delasimensah/ridgeway/pull/26
- RIDGE-13 PR (merged): https://github.com/delasimensah/ridgeway/pull/27
- RIDGE-12 PR (merged): https://github.com/delasimensah/ridgeway/pull/28
- RIDGE-40 PR (merged): https://github.com/delasimensah/ridgeway/pull/29
- RIDGE-44 PR (merged): https://github.com/delasimensah/ridgeway/pull/30
- RIDGE-42 PR: https://github.com/delasimensah/ridgeway/pull/31
- Product requirements: `docs/product/product-requirements.md`
- Linear tickets: `docs/product/linear-tickets.md`
- Screen design: `docs/ui-design/ridgeway/`
- Access list (private): `ACCESS-LIST.md`
- Practice pack (process paper): `project-template/docs/client-delivery/practice/ridgeway/`
- Convex cloud guide: `project-template/docs/client-delivery/convex-cloud-setup.md`
- Expo preview / ASC / Team ID: `project-template/docs/client-delivery/expo-preview-builds-and-slack.md`
