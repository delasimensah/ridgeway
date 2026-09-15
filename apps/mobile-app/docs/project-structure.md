# Project Structure

Complete overview of the mobile app. Product data is Convex `useQuery` / `useMutation`.

## Root

```
mobile-app/
├── app/                          # Expo Router routes (thin *Route files)
├── components/                   # Screens and reusable UI
├── constants/                    # Colors, fonts, assets
├── docs/                         # Mobile documentation
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript types
├── utils/                        # Helpers (Convex client, dates, toasts)
├── app.config.ts
├── eas.json
├── jest.setup.ts
└── package.json
```

## App routes (`app/`)

Route files stay thin. They load Convex data and render a `*Screen` from `components/screens/`.

```
app/
├── _layout.tsx                   # Fonts, providers, Stack.Protected
├── index.tsx                     # Redirect by session (sign-in, jobs, tenant rent, or not-allowed)
├── not-allowed.tsx               # Signed-in staff or owner
├── lease-ended.tsx               # Tenant whose lease has ended
├── (auth)/
│   ├── _layout.tsx
│   └── sign-in.tsx
├── (main-app)/                   # Field workers only
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Jobs and Account
│   │   ├── jobs/index.tsx
│   │   └── account/index.tsx
│   └── job/[workOrderId]/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── update-status.tsx     # Modal
│       └── completion-photo.tsx
└── (tenant-app)/                 # Tenants with a current lease
    ├── _layout.tsx
    └── (tabs)/
        ├── _layout.tsx           # Home, Repairs, Rent
        ├── home/index.tsx
        ├── repairs/index.tsx
        └── rent/index.tsx
```

`Stack.Protected` in `app/_layout.tsx` chooses the group:

- Signed-in field worker → `(main-app)`
- Signed-in tenant with a current lease → `(tenant-app)`
- Signed-in tenant whose lease has ended → `lease-ended`
- Signed-in staff or owner → `not-allowed`
- Signed out → `(auth)`

## Components (`components/`)

```
components/
├── index.ts
├── ui/                           # Button, Text, TextField, Stack, …
├── auth/                         # SignInForm
├── jobs/                         # JobCard, JobStatusChip, JobStatusOption, CompletionPhotoPicker
├── screens/
│   ├── auth/SignInScreen/
│   ├── field/                    # Jobs, JobDetail, UpdateStatus, CompletionPhoto, Account, NotAllowed
│   └── tenant/                   # Home, Rent, Repairs, LeaseEnded
├── rent/                         # RentStatusChip, TenantNextRentCard, invoice and history cards
├── shared/                       # AppProviders
├── feedback/
└── bottom-sheets/
```

Rules:

- Each component lives in `ComponentName/ComponentName.tsx` with a colocated test.
- No `index.ts` inside a component folder.
- Types stay inline on the component.
- Screens import other components with relative paths. Routes import screens from `@/components`.

## Hooks (`hooks/`)

```
hooks/
├── index.ts
├── auth/useFieldSession.ts
└── bottom-sheets/
```

There is no `index.ts` inside a category folder. Tests for a hook go in `__tests__/` in that category.

## Types and utils

- `types/jobs.ts` — list-item shape for job cards.
- `utils/` is flat. Every helper is exported from `utils/index.ts` and tested in `utils/__tests__/`.

## Adding work

1. New screen: add `components/screens/.../NameScreen.tsx` plus a thin `app/...` route. See [Adding Screens Guide](./adding-screens-guide.md).
2. New component: folder under `components/[category]/`, test, export from `components/index.ts`.
3. New hook: `hooks/[category]/useName.ts`, test in `__tests__/`, export from `hooks/index.ts`.
