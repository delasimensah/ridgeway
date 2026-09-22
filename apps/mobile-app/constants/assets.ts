/**
 * Asset paths for React Native. Use with expo-image / Image.
 */

export const ASSETS = {
  icons: {
    /** Transparent mark for in-app chrome. */
    logo: require("../assets/icons/icon-foreground.png"),
    /** Mark on gold — home screen / stores (non-adaptive). */
    appIcon: require("../assets/icons/icon.png"),
    /** Android adaptive foreground — smaller safe-zone padding. */
    adaptiveIcon: require("../assets/icons/adaptive-icon.png"),
  },
  images: {},
  videos: {},
  sounds: {},
} as const;
