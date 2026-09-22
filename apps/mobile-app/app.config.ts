import type { ConfigContext, ExpoConfig } from "expo/config";

const ASSET_PATHS = {
  appIcon: "./assets/icons/icon.png",
  /** Android adaptive foreground — safe-zone padded; not the full-bleed mark. */
  androidAdaptiveIcon: "./assets/icons/adaptive-icon.png",
  /** iOS Liquid Glass (Icon Composer). Older iOS falls back automatically. */
  appIconIos: "./assets/icons/ridgeway.icon",
  splashIcon: "./assets/icons/splash-icon.png",
};

const BRAND_COLOR = "#D6BD98";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_STAGING = process.env.APP_VARIANT === "staging";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.dmstudios.ridgeway.dev";
  }

  if (IS_STAGING) {
    return "com.dmstudios.ridgeway.staging";
  }

  return "com.dmstudios.ridgeway";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Ridgeway(Dev)";
  }

  if (IS_STAGING) {
    return "Ridgeway(Staging)";
  }

  return "Ridgeway";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "ridgeway",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "ridgeway",
  userInterfaceStyle: "automatic",
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
    icon: ASSET_PATHS.appIconIos,
    supportsTablet: true,
    infoPlist: {
      ...config.ios?.infoPlist,
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
    adaptiveIcon: {
      foregroundImage: ASSET_PATHS.androidAdaptiveIcon,
      backgroundColor: BRAND_COLOR,
    },
    predictiveBackGestureEnabled: false,
    softwareKeyboardLayoutMode: "resize",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-font",
    "expo-image",
    [
      "expo-image-picker",
      {
        photosPermission:
          "Ridgeway uses your photos so you can attach a picture to a repair or a completed job.",
        cameraPermission:
          "Ridgeway uses the camera so you can take a picture of a repair or a completed job.",
        microphonePermission: false,
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: BRAND_COLOR,
        image: ASSET_PATHS.splashIcon,
        imageWidth: 200,
        resizeMode: "contain",
        dark: {
          backgroundColor: BRAND_COLOR,
          image: ASSET_PATHS.splashIcon,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  updates: {
    url: "https://u.expo.dev/f2660fce-f32a-43b2-be0f-94f2a08a2c22",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  extra: {
    router: {},
    eas: {
      projectId: "f2660fce-f32a-43b2-be0f-94f2a08a2c22",
    },
  },
  owner: "dm-studios",
});
