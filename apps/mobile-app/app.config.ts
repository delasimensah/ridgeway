import type { ConfigContext, ExpoConfig } from "expo/config";

const ASSET_PATHS = {
  appIcon: "./assets/icons/icon.png",
  splashIcon: "./assets/icons/splash-icon.png",
};

const BRAND_COLOR = "#208AEF";

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
    icon: ASSET_PATHS.appIcon,
    supportsTablet: true,
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
    adaptiveIcon: {
      foregroundImage: ASSET_PATHS.appIcon,
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
      "expo-splash-screen",
      {
        ios: {
          backgroundColor: BRAND_COLOR,
          image: ASSET_PATHS.splashIcon,
          resizeMode: "cover",
        },
        android: {
          backgroundColor: BRAND_COLOR,
          image: ASSET_PATHS.splashIcon,
          imageWidth: 150,
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
