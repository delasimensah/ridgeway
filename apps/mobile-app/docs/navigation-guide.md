# Navigation Guide

Expo Router uses file-based routing. Field workers land on Jobs. Everyone else who can sign in sees Not allowed.

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

`app/_layout.tsx` uses Expo Router `Stack.Protected`. Do not add a second redirect layer after sign-in; the guard chooses the group. Do not swap the stack for a full-screen loader after the session token is known.

- Cold start waits for fonts and Convex auth restore under the native splash, then shows the stack. Profile and jobs load on the destination screen.
- Signed-in field worker, or signed-in while the profile is still loading → `(main-app)`
- Signed-in staff, owner, or tenant (after the profile is known) → `not-allowed`
- Signed out → `(auth)`
- Root stack animation is off so sign-in does not slide onto Jobs. Nested job screens still slide.

Sign-in does not call `router.push`. After `signIn` succeeds, the guard shows Jobs. Jobs and job detail stay on screen and show skeleton placeholders until their queries return. Do not replace either screen with `LoadingScreen`.

`app/index.tsx` is the fallback for `/`. It sends the same people to sign-in, jobs, or not-allowed. It does not show a loading screen.

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
