import { Platform } from "react-native";

const ANDROID_NAV_BAR_MIN = 48;

export function bottomSafePad(
  insetsBottom: number,
  os: typeof Platform.OS = Platform.OS
): number {
  if (os === "android") {
    return Math.max(insetsBottom, ANDROID_NAV_BAR_MIN);
  }
  return insetsBottom;
}
