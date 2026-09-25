import React from "react";
import {
  Platform,
  Pressable,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { cn } from "shared";

import { COLORS } from "@/constants";

import { VStack } from "../Stack/Stack";

const CARD_SHADOW: ViewStyle = Platform.select({
  ios: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  android: {
    elevation: 2,
  },
  default: {},
})!;

export interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  /** Left status accent (Jobber-style). */
  stripeColor?: string;
  paddingClassName?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: "button" | "link" | "none";
}

/**
 * White card on the warm page fill. Light shadow + border so Android and iOS
 * both get lift without glass or heavy drop shadows.
 */
const SurfaceCard: React.FC<SurfaceCardProps> = ({
  children,
  className,
  style,
  stripeColor,
  paddingClassName = "p-4",
  onPress,
  accessibilityLabel,
  accessibilityRole = "button",
}) => {
  const body = (
    <View
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-white",
        className
      )}
      style={[CARD_SHADOW, style]}
    >
      <View className="flex-row">
        {stripeColor ? (
          <View
            className="w-1 self-stretch"
            style={{ backgroundColor: stripeColor }}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        ) : null}
        <VStack spacing="none" className={cn("flex-1", paddingClassName)}>
          {children}
        </VStack>
      </View>
    </View>
  );

  if (!onPress) {
    return body;
  }

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
    >
      {body}
    </Pressable>
  );
};

export default SurfaceCard;
