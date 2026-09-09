# Ridgeway

Operations software for Ridgeway Property Group: staff command center, owner portal, tenant repairs and rent status, and a field phone app.

This is a Turborepo with a Next.js website, an Expo phone app, a shared TypeScript package, and a Convex backend. Convex Auth and Convex queries are wired on the website. Do not import Convex in the mobile app until a ticket needs it.

## Stack

- **Web:** Next.js (App Router), React 19, Mantine, Tailwind CSS
- **Mobile:** Expo, Expo Router, NativeWind
- **Backend:** Convex
- **Shared:** types, Zod schemas, colors, utilities

Product source of truth: [docs/product/product-requirements.md](./docs/product/product-requirements.md).

## Prerequisites

- Node.js 22.13 or later (Expo SDK 57 requirement)
- Yarn 1.22

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Start Convex, then the app you need to click through:

```bash
yarn dev:backend
yarn dev:web      # http://localhost:3001
yarn dev:mobile   # development client (needs a Ridgeway(Dev) native app)
```

## Commands

```bash
yarn lint
yarn format:check
yarn type-check
yarn test:ci
yarn dev:backend
yarn dev:web
yarn dev:mobile
```
