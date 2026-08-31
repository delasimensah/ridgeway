import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Ridgeway",
  slug: "ridgeway",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "ridgeway",
  userInterfaceStyle: "automatic",
  ios: {
    ...config.ios,
    bundleIdentifier: "com.delasimensah.ridgeway",
    supportsTablet: true,
  },
  android: {
    ...config.android,
    package: "com.delasimensah.ridgeway",
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
  },
});
