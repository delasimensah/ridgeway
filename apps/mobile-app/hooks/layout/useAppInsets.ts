import { useSafeAreaInsets } from "react-native-safe-area-context";

import { bottomSafePad } from "@/utils";

export function useAppInsets() {
  const insets = useSafeAreaInsets();

  return {
    top: insets.top,
    left: insets.left,
    right: insets.right,
    bottom: bottomSafePad(insets.bottom),
  };
}
