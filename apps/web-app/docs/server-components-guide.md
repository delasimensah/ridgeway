# Server Components in this web app

> **Purpose**: How Next.js App Router Server Components and Client Components fit this app. Product data is Convex.

Official references:

- [Next.js — Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Convex + Next.js](https://docs.convex.dev/quickstart/nextjs)

---

## Defaults

- `app/` layouts and pages are Server Components by default.
- Add `"use client"` when the module needs hooks, browser APIs, event handlers, or React Context.

Use a **Client Component** when you need Convex `useQuery` / `useMutation`, auth hooks, or Mantine interactive UI.
