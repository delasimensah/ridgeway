# Cursor rules (Ridgeway)

Rules guide the agent for this monorepo.

## Always on (every chat)

- **`linear-issue-status.mdc`** — Todo → In Progress → Done. Backlog is later work only.
- **`wait-for-approval-before-git.mdc`** — Implement and stop. Do not commit, push, or open a PR until asked.
- **`web-responsive.mdc`** — Website is always responsive, even without mobile mockups. Read `docs/responsive-design-guide.md`.
- **`mandatory-project-docs.mdc`** — Which `docs/` files to read before implementing (by task type).
- **`docs-this-project-only.mdc`** — Product docs describe this project only. No studio process. No unused-stack lists.
- **`mandatory-checks-before-coding.mdc`** — Pre-flight checklist; includes mandatory docs step.
- **`code-organization-and-style.mdc`** — Structure, components, hooks, services, imports.
- **`base-developer.mdc`**, **`no-inference-no-guessing.mdc`**, **`write-full-sentences.mdc`**, **`fix-linting-errors.mdc`**, and other global conventions.

## Scoped by path (only when matching files are in play)

- **`apps/mobile-app/**`** — `mobile-view-usage.mdc`, `mobile-screen-spacing.mdc` (VStack/HStack, Stack spacing).
- **`apps/web-app/**/*.tsx`** — `web-mantine-over-html.mdc`.
- **`**/*.md`**, **`**/*.mdc`** — `markdown-no-tables.mdc`.
- **`apps/**/*`, `packages/**/*`, `convex/**/*`** — `official-documentation.mdc` (prefer framework @Docs).

## ESLint (web + mobile)

- Inside **`components/`**: no `@/components/...` (relative paths for components).
- **Barrels only** for `@/constants`, `@/hooks`, `@/utils`, `@/services`, `shared`. When Convex is wired, generated API uses `convex/_generated/api`.

## Entry point

**`AGENTS.md`** — Stack, official doc URLs, compliance summary.
