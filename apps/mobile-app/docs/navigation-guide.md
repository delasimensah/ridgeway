# Navigation Guide

Expo Router uses file-based routing. Field workers land on Jobs. Tenants with a current lease land on Home. Everyone else who can sign in sees Not allowed.

## Route tree

```
app/
├── index.tsx                     → redirect by session
├── (auth)/sign-in.tsx
├── not-allowed.tsx
└── (main-app)/
    ├── (tabs)/jobs
    ├── (tabs)/account
    └── job/[workOrderId]
        ├── update-status         (modal)
        └── completion-photo
```

## Protected routes

`app/_layout.tsx` uses Expo Router `Stack.Protected`. Do not add a second redirect layer after sign-in; the guard chooses the group. Do not swap the stack for a full-screen loader after the role is known.

- Cold start waits for fonts and Convex auth restore under the native splash, then shows the stack.
- Signed-in while the profile is still loading → Ridgeway on the gold (`RoleWaitScreen`). Not field Jobs.
- Signed-in field worker → `(main-app)`
- Signed-in tenant with a current lease → `(tenant-app)`
- Signed-in tenant whose lease has ended → `lease-ended`
- Signed-in staff or owner → `not-allowed`
- Signed out → `(auth)`
- Do not mount `(main-app)` while the profile is still loading. That is how a tenant briefly saw field Jobs.
- Root stack animation is off so sign-in does not slide onto Jobs. Nested job screens still slide.

Sign-in does not call `router.push`. After `signIn` succeeds, the guard shows Jobs for a field worker, or tenant home for a tenant. Jobs and job detail stay on screen and show skeleton placeholders until their queries return. Do not replace either screen with a full-page wait.

`app/index.tsx` is the fallback for `/`. It sends the same people to sign-in, jobs, tenant home, lease-ended, or not-allowed. While a signed-in profile is still loading it shows `RoleWaitScreen`.

## Path rules

Same route group: short path.

```tsx
// From app/(auth)/index-style routes
router.replace("/sign-in");
```

Different groups: include the groups.

```tsx
router.push("/(main-app)/(tabs)/jobs");
router.push(`/(main-app)/job/${workOrderId}`);
router.push(`/(main-app)/job/${workOrderId}/update-status`);
router.replace("/(auth)/sign-in");
```

Between tabs in `(tabs)`:

```tsx
router.push("/(main-app)/(tabs)/account");
```

## Methods

- `router.push()` — open a screen (job detail, update status).
- `router.replace()` — sign-in and after complete, so back does not return to the old job.
- `router.back()` — close a modal or return from detail.

TypeScript autocomplete on `router.push("` lists valid routes (`experiments.typedRoutes` is on).
