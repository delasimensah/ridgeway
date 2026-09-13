import { ConvexReactClient } from "convex/react";

export function createConvexClient(): ConvexReactClient {
  const url = process.env.EXPO_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("EXPO_PUBLIC_CONVEX_URL is not set");
  }

  return new ConvexReactClient(url, {
    unsavedChangesWarning: false,
  });
}
