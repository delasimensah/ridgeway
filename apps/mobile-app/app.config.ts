import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Ridgeway",
  slug: "ridgeway",
  owner: "dm-studios",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "ridgeway",
  userInterfaceStyle: "automatic",
  ios: {
    ...config.ios,
    bundleIdentifier: "com.dmstudios.ridgeway",
    supportsTablet: true,
  },
  android: {
    ...config.android,
    package: "com.dmstudios.ridgeway",
    adaptiveIcon: {
      backgroundColor: "#ffffff",
    },
  },
  plugins: ["expo-router", "expo-secure-store", "expo-font"],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "f2660fce-f32a-43b2-be0f-94f2a08a2c22",
    },
  },
});
