# Adding Screens Guide

How to add a screen to the Ridgeway field or tenant app.

## Architecture

Expo Router files under `app/` are thin `*Route` components. They call Convex `useQuery` / `useMutation` and render a `*Screen` from `components/screens/`.

```
Root Stack (app/_layout.tsx)
├── index                  Redirect by session
├── (auth)                 Sign in
├── not-allowed            Signed-in staff or owner
├── lease-ended            Tenant whose lease has ended
├── (main-app)             Field workers
│   ├── (tabs)
│   │   ├── jobs
│   │   └── account
│   └── job/[workOrderId]
│       ├── update-status  Modal
│       └── completion-photo
└── (tenant-app)           Tenants with a current lease
    └── (tabs)
        ├── home
        ├── repairs
        └── rent
```

## 1. Add a tab screen

1. Put the UI in `components/screens/field/NameScreen/NameScreen.tsx` with a test.
2. Export it from `components/index.ts`.
3. Add `app/(main-app)/(tabs)/name/index.tsx` as a `*Route` that loads data and renders the screen.
4. Register the tab in `app/(main-app)/(tabs)/_layout.tsx`.

```tsx
<Tabs.Screen
  name="name"
  options={{
    title: "Name",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="ellipse" size={size} color={color} />
    ),
  }}
/>
```

## 2. Add a stack screen (job-style)

Job detail sits outside the tabs so the tab bar is hidden.

1. Create the screen under `components/screens/field/`.
2. Add `app/(main-app)/job/[workOrderId]/name.tsx`.
3. Register it in `app/(main-app)/job/[workOrderId]/_layout.tsx`.

```tsx
<Stack.Screen name="name" />
```

Navigate with the full path:

```tsx
router.push(`/(main-app)/job/${workOrderId}/name`);
```

## 3. Add a modal

Same as a stack screen, with modal presentation:

```tsx
<Stack.Screen name="update-status" options={{ presentation: "modal" }} />
```

Close with `router.back()`.

## 4. Add an auth screen

1. Screen under `components/screens/auth/`.
2. Route under `app/(auth)/`.
3. Register in `app/(auth)/_layout.tsx`.

Sign-in is `app/(auth)/sign-in.tsx`. Staff set passwords on the website.

## Route file shape

```tsx
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { router } from "expo-router";

import { JobsScreen } from "@/components";

const JobsRoute = () => {
  const jobs = useQuery(api.workOrders.listForCurrentField);

  return (
    <JobsScreen
      jobs={jobs ?? []}
      isLoading={jobs === undefined}
      onOpenJob={(jobId) => {
        router.push(`/(main-app)/job/${jobId}`);
      }}
    />
  );
};

export default JobsRoute;
```

Keep route files under a few dozen lines. Layout, copy, and lists live in the screen component. Permission checks stay in Convex.

## Related

- [Navigation Guide](./navigation-guide.md)
- [Project Structure](./project-structure.md)
