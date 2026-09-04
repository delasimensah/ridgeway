# Agent instructions for Ridgeway

This is a **Turborepo** with a **Next.js** web app, an **Expo** mobile app, a **shared** package, and a **Convex** backend. Convex packages and `convex/` are in the repo. Do not import Convex in the apps until it is wired.

## Where we left off

Read **`STATUS.md`** at the repo root before planning or implementing. It is the phase checklist (workshop vs product). Update it when you finish a phase or change the next action. Do not put secrets in `STATUS.md`.

## Compliance (do this before coding)

- **`.cursor/rules/mandatory-project-docs.mdc`** — Always applied. For your task type, **read the listed `docs/...` files** (and app docs) with the Read tool before implementing.
- **Lint (barrel imports):** Top-level barrels — `@/constants`, `@/hooks`, `@/utils`, `@/assets`, `@/services`, `shared`. Inside `components/`, relative imports for components. Run lint after edits.

## Code organization and style

A Cursor project rule (`.cursor/rules/code-organization-and-style.mdc`) is applied to every chat. In summary:

- **Web app:** Follow `apps/web-app/docs/project-structure.md` and `apps/web-app/docs/developer-decision-guide.md`.
- **Mobile app:** Follow `apps/mobile-app/docs/project-structure.md`, `apps/mobile-app/docs/developer-decision-guide.md`, and `apps/mobile-app/docs/adding-screens-guide.md`.
- **Shared package:** Follow `packages/shared/docs/contributing-guide.md`.
- **Imports, exports, component placement:** Follow `docs/import-patterns-guide.md`, `docs/export-patterns-guide.md`, `docs/component-organization-guide.md`.

Components go in folders with tests; no `index.ts` inside component or service/hook subdirectories; use `@/` for cross-folder imports; barrel exports from top-level `index.ts` only.

## Product and architecture

When planning or implementing features, read:

- **`docs/product/product-requirements.md`** — What we are building. Do not invent features that are not in this file.
- **`docs/product/system-design.md`** and **`docs/product/convex-design.md`** — Only after those files exist. Until then, do not invent tables or permission rules beyond the product requirements.

## Stack and official docs

Prefer these official sources. Add them as **@Docs** in Cursor (Settings → Indexing & Docs).

### Monorepo and tooling

- **Turborepo:** https://turbo.build/repo/docs
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Yarn workspaces:** https://classic.yarnpkg.com/en/docs/workspaces/

### Web (`apps/web-app`)

- **Next.js:** https://next.js.org/docs
- **React:** https://react.dev/reference
- **Mantine:** https://mantine.dev/
- **React Hook Form:** https://react-hook-form.com/
- **Zod:** https://zod.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs

### Mobile (`apps/mobile-app`)

- **Expo:** https://docs.expo.dev/
- **Expo Router:** https://docs.expo.dev/router/introduction/
- **React Native:** https://reactnative.dev/docs/getting-started
- **NativeWind:** https://www.nativewind.dev/
- **React Hook Form:** https://react-hook-form.com/
- **Zod:** https://zod.dev/

### Backend and shared

- **Convex:** https://docs.convex.dev
- **Convex + Next.js:** https://docs.convex.dev/quickstart/nextjs
- **Convex + React Native:** https://docs.convex.dev/quickstart/react-native
- **Convex Auth:** https://labs.convex.dev/auth
- **Zustand:** https://zustand.docs.pmnd.rs/
- **Zod:** https://zod.dev/

## Hard rules for this product

- Product data will use Convex `useQuery` / `useMutation` after Convex is added. Do not import Convex in the apps until then.
- Permission checks belong at the top of every public Convex function. The client is not trusted.
- Owner A must never read Owner B’s rows. Work orders are never silently deleted.
- Zustand is only for client session extras, not buildings or tickets.

## How to get the best results

1. Add the docs above to Cursor **Settings → Indexing & Docs**.
2. Mention the stack in prompts (e.g. “Using Next.js App Router, Mantine, and Convex Auth…”).
3. Implement one Linear ticket at a time. Do not expand scope.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
