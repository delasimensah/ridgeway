/**
 * Color System - Shared Package
 *
 * Locked Ridgeway tokens. Web Tailwind and phone NativeWind both read these.
 */

export const COLORS = {
  white: "#FFFFFF",
  black: "#000000",
  primary: "#1A3636",
  primaryHover: "#40534C",
  accent: "#D6BD98",
  /** Darker than accent, for money and status text on white. */
  accentInk: "#8A6B3A",
  grey: "#677D6A",
  lightGrey: "#E8E4DA",
  darkGrey: "#1A3636",
  border: "#E8E4DA",
  sidebar: "#F7F5F0",
  shimmerLight: "#F7F5F0",
  overdue: "#7F2020",
  danger: "#7F2020",
  dangerHover: "#5A1717",
  /** Status dots. Brighter than the brand inks so a small mark still reads. */
  dotGreen: "#2BA86A",
  dotBlue: "#3B82F6",
  dotGold: "#E2A325",
  dotRed: "#E24B4A",
  dotTeal: "#14A3A0",
} as const;
