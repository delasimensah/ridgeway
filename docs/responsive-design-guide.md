# Responsive design guide

> **Purpose**: How to make the website work on phone, tablet, and desktop. **Web app only.** Missing mobile or tablet mockups does not skip this.

The website is always responsive. Field work uses the Expo app; people still open this site on phones and tablets, and it has to be usable there.

---

## Breakpoints (do not mix them up)

**Tailwind** (class prefixes such as `sm:`, `md:`, `lg:`):

- `sm:` — 640px and up
- `md:` — 768px and up
- `lg:` — 1024px and up
- `xl:` — 1280px and up
- `2xl:` — 1536px and up

**Mantine** (AppShell, SimpleGrid, `hiddenFrom`, `visibleFrom`, style props). Default theme, 1em = 16px:

- `sm` — 48em (768px)
- `md` — 62em (992px)
- `lg` — 75em (1200px)

Mantine `sm` is not Tailwind `sm`. Use Mantine keys on Mantine props. Use Tailwind prefixes on `className`.

---

## Staff AppShell (Ridgeway)

Official pattern: navbar `breakpoint` plus a burger below that width. Use the `padding` prop on `AppShell`, not Tailwind padding on `AppShell.Main` (that padding is part of the navbar offset math).

Current values:

- Navbar width: 256px from Mantine `md` (992px) up
- Below 992px: overlay navbar, 56px header, burger
- Main padding: 16 (base), 24 (`sm` / 768px), 32 (`md` / 992px), 48 (`lg` / 1200px)

Remaining content width (viewport − sidebar − padding × 2):

- Phone 375: overlay nav, 16px padding → about 343px
- Tablet 768: overlay nav, 24px padding → about 720px
- 1024 (design “usable”): 256px sidebar, 32px padding → about 704px
- 1280 (design desktop): 256px sidebar, 48px padding → about 928px

If a layout is tight, recalculate with those formulas before inventing a new breakpoint.

---

## What to do on each kind of screen

- **Stack** grids and form pairs on the narrow remaining width (`SimpleGrid cols={{ base: 1, sm: 2 }}` when two columns need about 720px).
- **Wrap** page titles and primary actions (`Group wrap="wrap"`). Full-width buttons on phone, auto width from Tailwind `sm`.
- **Scale type**: page titles 24px on phone, 28px from Tailwind `sm`, 32px from Tailwind `md`.
- **Tables** may scroll horizontally. `Table.ScrollContainer` `minWidth` should fit from the persistent-sidebar width up (640px fits the 704px main at 1024).
- **Empty states** use min-height and smaller padding on phone. Do not lock a 400px box on a 667px-tall screen.
- Close the overlay nav when the route changes.

---

## Mantine layout props

```tsx
<Grid gutter="xl">
  <Grid.Col span={{ base: 12, lg: 6 }}>{/* stacks on phone */}</Grid.Col>
  <Grid.Col span={{ base: 12, lg: 6 }}>{/* half from Mantine lg */}</Grid.Col>
</Grid>
```

```tsx
<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
  <Select label="Area" ... />
  <Select label="City" ... />
</SimpleGrid>
```

```tsx
<AppShell
  navbar={{
    width: 256,
    breakpoint: "md",
    collapsed: { mobile: !opened },
  }}
  padding={{ base: 16, sm: 24, md: 32, lg: 48 }}
>
```

---

## Tailwind on className

```tsx
<Box className="p-4 sm:p-6 md:p-8">
```

```tsx
<Title className="text-[24px] sm:text-[28px] md:text-[32px]" />
```

---

## See also

- Mantine AppShell: https://mantine.dev/core/app-shell/
- Mantine responsive styles: https://mantine.dev/styles/responsive/
- Tailwind responsive design: https://tailwindcss.com/docs/responsive-design
- [Component building guide](./component-building-guide.md)
