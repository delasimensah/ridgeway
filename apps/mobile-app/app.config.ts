import type { ConfigContext, ExpoConfig } from "expo/config";

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
  owner: "dm-studios",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "ridgeway",
  userInterfaceStyle: "automatic",
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
    supportsTablet: true,
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
    adaptiveIcon: {
      backgroundColor: "#ffffff",
    },
  },
  plugins: ["expo-router", "expo-secure-store", "expo-font", "expo-image"],
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
});
