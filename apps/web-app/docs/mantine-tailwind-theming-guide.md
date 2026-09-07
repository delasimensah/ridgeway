# Mantine + Tailwind theming

> **Purpose**: How to theme the web app when you use **Mantine** for components and **Tailwind** for most layout and visual customization, without fighting between the two systems.

Related: [Mantine Component Guide](./mantine-component-guide.md), [Component Building Guide](../../../docs/component-building-guide.md), [Responsive Design Guide](../../../docs/responsive-design-guide.md).

---

## How responsibilities split

- **Mantine** — Component structure, accessibility, built-in behaviour (modals, inputs, focus rings). Import `@mantine/core/styles.css` (and other Mantine packages) once in the root layout.
- **Tailwind** — Most customization via **`className`** on Mantine components and on layout wrappers: spacing, typography utilities, semantic colors, responsive breakpoints.
- **Single source of truth for color** — Define palette in **`packages/shared/src/constants/colors.ts`**, re-export from `apps/web-app/constants/colors.ts`, then wire into **`tailwind.config.js`** `theme.extend.colors`. Do not scatter hex values in components.

Mantine documents that **Tailwind’s Preflight** (from `@tailwind base`) can override Mantine’s base styles. If buttons look transparent or wrong after global CSS changes, see [Mantine help — transparent buttons](https://help.mantine.dev/q/transparent-buttons) and the [Tailwind + Mantine discussions](https://github.com/orgs/mantinedev/discussions/1672). This project currently uses full Tailwind layers in `app/globals.css`; watch for conflicts and fix with Mantine **`styles`** / **Styles API** or theme overrides, not only more Tailwind.

---

## 1. Wire shared colors into Tailwind

**Step A — palette in shared** (`packages/shared/src/constants/colors.ts`):

```ts
export const COLORS = {
  white: "#FFFFFF",
  black: "#000000",
  grey: "#808080",
  lightGrey: "#C2C2C2",
  darkGrey: "#1C1C1C",
  border: "#262626",
  shimmerLight: "#303030",
  // Add brand tokens once, e.g.:
  // primary: "#EAB308",
  // primaryHover: "#CA8A04",
} as const;
```

**Step B — web app re-exports** (`apps/web-app/constants/colors.ts`):

```ts
import { COLORS as SHARED_COLORS } from "shared";

export const COLORS = {
  ...SHARED_COLORS,
} as const;
```

**Step C — Tailwind extend** (`apps/web-app/tailwind.config.js`):

```js
const { COLORS } = require("./constants/colors.ts");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: COLORS.white,
        black: COLORS.black,
        grey: COLORS.grey,
        lightGrey: COLORS.lightGrey,
        darkGrey: COLORS.darkGrey,
        border: COLORS.border,
        shimmerLight: COLORS.shimmerLight,
        // After adding `primary` to shared COLORS:
        // primary: COLORS.primary,
        // primaryHover: COLORS.primaryHover,
      },
      fontFamily: {
        appFont: ["var(--app-font)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

Use semantic classes in UI: `className="bg-darkGrey text-grey border-border"`, not `bg-[#1C1C1C]`.

---

## 2. Root layout: font variable + Mantine CSS before Tailwind

**`app/layout.tsx`** (pattern already in the project):

```tsx
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "./globals.css";

import type { Metadata } from "next";
import React from "react";

import { appfont } from "@/constants";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Template App",
  description: "A starter Next.js application",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={appfont.variable} suppressHydrationWarning>
      <body className="font-regular bg-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
```

**`app/globals.css`** — Tailwind layers after Mantine imports in the layout:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`appfont` sets `--app-font` (see `constants/fonts.ts`). Tailwind `font-appFont` maps to that variable in `tailwind.config.js`.

---

## 3. Optional: align Mantine `createTheme` with Tailwind (minimal theme)

Most day-to-day styling can stay **Tailwind on `className`**. Use **`createTheme`** when you want Mantine defaults (unstyled-by-Tailwind inner states) to match your app font and radius, or when you follow [Mantine’s theme object](https://mantine.dev/theming/theme-object) for `primaryColor` and built-in palettes.

**Minimal theme** (matches `--app-font` from `constants/fonts.ts`):

```ts
// apps/web-app/theme/mantine-theme.ts
import { createTheme } from "@mantine/core";

export const mantineTheme = createTheme({
  fontFamily: "var(--app-font), system-ui, sans-serif",
  defaultRadius: "md",
});
```

**Wire it in** `app/providers.tsx` — the template already imports `mantineTheme` and passes **`theme={mantineTheme}`** to `MantineProvider`.

To map **Mantine `primaryColor`** to your brand while keeping **Tailwind** as the main tool, add the right **`colors`** entries to `createTheme` per Mantine docs (10-shade arrays), or style primary buttons with Tailwind **`className`** and skip custom Mantine palettes.

---

## 4. Tailwind-first styling on Mantine components

Prefer Mantine primitives + **`className`** (Tailwind) for most screens.

```tsx
import { Button, Stack, Title } from "@mantine/core";

import { Text } from "@/components";

export const ExampleSection = () => {
  return (
    <Stack gap="md" className="border-border bg-darkGrey rounded-lg border p-6">
      <Title order={2} className="font-bold text-white">
        Section title
      </Title>
      <Text className="font-regular text-grey">
        Body copy uses the project Text wrapper and Tailwind tokens.
      </Text>
      <Button
        type="button"
        variant="default"
        className="border-border hover:bg-border border bg-transparent font-medium text-white"
      >
        Secondary action
      </Button>
    </Stack>
  );
};
```

Use **`COLORS`** from `@/constants` only when a prop must be a color value (e.g. some chart or icon APIs), not for layout.

---

## 5. When `className` is not enough: Mantine `styles` / Styles API

Tailwind on the **root** of a Mantine component does not always style **inner** parts (e.g. input wrapper vs input). Use the **`styles`** prop or [Styles API](https://mantine.dev/styles/styles-api) for those elements.

```tsx
import { TextInput } from "@mantine/core";

export const ThemedField = () => {
  return (
    <TextInput
      label="Email"
      placeholder="you@example.com"
      classNames={{
        label: "text-grey font-medium",
        input:
          "border-border bg-black font-regular text-white placeholder:text-grey",
      }}
    />
  );
};
```

`classNames` is often enough for v7+ Mantine components that expose slots.

---

## 6. Dark mode (when you add it)

If you introduce Mantine color schemes, add **`ColorSchemeScript`** in `<head>` and **`mantineHtmlProps`** on `<html>` per [Mantine — Color schemes](https://mantine.dev/theming/color-schemes) so SSR and hydration stay correct. Align Tailwind dark mode (`dark:` classes or `dark` variant in `tailwind.config`) with the same user preference.

---

## 7. Quick checklist

- Add or change brand colors in **`packages/shared`** first, then Tailwind `extend`.
- **Mantine** for structure and components; **Tailwind** for most layout and look via **`className`**.
- **No arbitrary hex** in components — use semantic Tailwind classes backed by `COLORS`.
- Use **`styles` / `classNames`** when Mantine internals do not pick up Tailwind on the root.
- If global CSS breaks Mantine controls, check **Preflight** and Mantine’s troubleshooting docs before overriding blindly.

---

## Related docs

- [Mantine Component Guide](./mantine-component-guide.md)
- [Component Building Guide](../../../docs/component-building-guide.md)
- [Import Patterns Guide](../../../docs/import-patterns-guide.md)
- [Mantine — Theme object](https://mantine.dev/theming/theme-object)
- [Mantine — Styles API](https://mantine.dev/styles/styles-api)
- [Tailwind — Preflight](https://tailwindcss.com/docs/preflight)
