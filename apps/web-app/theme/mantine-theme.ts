import { createTheme } from "@mantine/core";

/**
 * Mantine theme aligned with app font (`--app-font` from `constants/fonts.ts`).
 * Most visual customization uses Tailwind `className` on Mantine components; see
 * `docs/mantine-tailwind-theming-guide.md`.
 */
export const mantineTheme = createTheme({
  fontFamily: "var(--app-font), system-ui, sans-serif",
  defaultRadius: "md",
});
