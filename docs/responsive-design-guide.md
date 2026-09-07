# Responsive design guide

> **Purpose**: Patterns for making web pages responsive with Mantine and Tailwind. **Web app only** — Mantine is not used in the mobile app.

## Overview

The web app uses Mantine's responsive props and Tailwind breakpoints to adapt layouts for mobile, tablet, and desktop. Make all pages responsive by default.

---

## Mantine responsive props

### Grid and SimpleGrid

- **Grid.Col** — Use `span` with breakpoint object: `span={{ base: 12, lg: 6 }}` for full width on mobile, half on large screens.
- **SimpleGrid** — Use `cols` with breakpoint object: `cols={{ base: 1, md: 2 }}` for one column on mobile, two on medium+.

**Example: two-column form layout**

```tsx
<Grid gutter="xl">
  <Grid.Col span={{ base: 12, lg: 6 }}>
    {/* Left column — stacks on mobile */}
  </Grid.Col>
  <Grid.Col span={{ base: 12, lg: 6 }}>{/* Right column */}</Grid.Col>
</Grid>
```

**Example: form field pairs**

```tsx
<SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
  <Select label="Listing Type" ... />
  <Select label="Property Type" ... />
</SimpleGrid>
```

---

## Tailwind breakpoints

Use Tailwind's responsive prefixes for spacing, typography, and visibility:

- `sm:` — 640px and up
- `md:` — 768px and up
- `lg:` — 1024px and up
- `xl:` — 1280px and up
- `2xl:` — 1536px and up

**Example: responsive padding (less on mobile)**

```tsx
<Box className="px-4 pb-8 pt-32 sm:px-6 md:px-8">
```

Use smaller padding on mobile (e.g. `px-4`, `p-4`) and increase on larger breakpoints to avoid squeezed content on small screens.

If your app has a shared page wrapper component (e.g. for admin or dashboard layouts), use it for consistent padding and edit padding in one place. Use a compact header offset where appropriate (e.g. `pt-24` for pages with shorter headers).

**Example: responsive visibility**

```tsx
<Burger hiddenFrom="sm" ... />
<Title className="hidden sm:block sm:text-2xl md:text-3xl" />
```

---

## Breakpoint alignment

- **base** (Mantine) ≈ no prefix (Tailwind) — mobile-first
- **sm** — both use 640px
- **md** — both use 768px
- **lg** — both use 1024px

Use consistent breakpoints across Mantine and Tailwind (e.g. `lg` for switching to two-column layout).

---

## See also

- Mantine responsive styles: https://mantine.dev/styles/responsive/
- Tailwind responsive design: https://tailwindcss.com/docs/responsive-design
- [Component building guide](./component-building-guide.md)
