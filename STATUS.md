# Project status (read this first)

**For agents and humans:** this is the handoff checklist for this job. Update it when a phase finishes or the “next” item changes. Code alone does not show workshop vs product phase.

**Do not put secrets here.** URLs and “done” notes are fine. Passwords, webhook values, `.p8` paths, and deploy keys stay in `ACCESS-LIST.md` (gitignored) or vendor dashboards.

---

## Snapshot

- **Client / job:** Ridgeway Property Group (practice). Outcome B (apps on studio accounts).
- **Backend:** Convex
- **Current phase:** System design locked → **next is screen design**
- **Last updated:** 5 Sep 2026
- **Blocked / open:** none. `docs/product/system-design.md` and `docs/product/convex-design.md` are written and the open architecture calls are decided, with the reasons recorded in section 15 of the system design. Two things land with the first build slice rather than now: Vitest for the `convex/` folder, and the `convex-helpers` dependency behind the wrapped function declarations.

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
- [ ] Screen design / UX Pilot exports (07)
- [ ] Linear build tickets with design links (08)
- [ ] Build slices, demos, TestFlight / Play testing (09)
- [ ] Launch / walk-away notes (10)
- [ ] Evidence log paragraphs as phases lock

---

## Next action (one line)

Start screen design. Build tickets need screen links, so no product tables or Convex functions until screens exist.

---

## Pointers

- Product requirements: `docs/product/product-requirements.md`
- Access list (private): `ACCESS-LIST.md`
- Practice pack (process paper): `project-template/docs/client-delivery/practice/ridgeway/`
- Convex cloud guide: `project-template/docs/client-delivery/convex-cloud-setup.md`
- Expo preview / ASC / Team ID: `project-template/docs/client-delivery/expo-preview-builds-and-slack.md`
