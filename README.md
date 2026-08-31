# Ridgeway

Operations software for Ridgeway Property Group: staff command center, owner portal, tenant repairs and rent status, and a field phone app.

This is a Turborepo with a Next.js website, an Expo phone app, a shared TypeScript package, and a Convex backend.

## Stack

- **Web:** Next.js (App Router), React 19, Mantine, Tailwind CSS
- **Mobile:** Expo, Expo Router, NativeWind
- **Backend:** Convex (database, functions, file storage, Convex Auth)
- **Shared:** types, Zod schemas, colors, utilities

Convex queries and mutations are the data layer. Zustand is only for client extras.

Product source of truth: [docs/product/product-requirements.md](./docs/product/product-requirements.md).

## Prerequisites

- Node.js 22.13 or later (Expo SDK 57 requirement)
- Yarn 1.22
- A Convex account ([convex.dev](https://www.convex.dev))

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Start the Convex backend (creates `.env.local` with deployment URLs):

```bash
yarn dev:backend
```

The first run opens a browser to log in and create a Convex project. It also generates `convex/_generated`.

3. Copy the Convex URL into each app:

- `apps/web-app/.env.local` — `NEXT_PUBLIC_CONVEX_URL=`
- `apps/mobile-app/.env.local` — `EXPO_PUBLIC_CONVEX_URL=`

4. Generate Convex Auth keys (password sign-in does not need `SITE_URL`):

```bash
npx @convex-dev/auth
```

Or follow the [manual Convex Auth setup](https://labs.convex.dev/auth/setup/manual).

5. Start the apps (in another terminal):

```bash
yarn dev:web      # http://localhost:3001
yarn dev:mobile   # Expo QR code
```

## Commands

```bash
yarn dev:web
yarn dev:mobile
yarn dev:backend
yarn lint
yarn type-check
yarn test
yarn format
```
