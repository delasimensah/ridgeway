import { Image } from "expo-image";
import React from "react";
import type { AccessibilityRole, StyleProp, TextStyle } from "react-native";
import { cn } from "shared";

import { ASSETS } from "@/constants";

import { HStack, VStack } from "../Stack/Stack";
import Text from "../Text/Text";

type BrandMarkSize = "header" | "page" | "splash";

const SIZE_CONFIG: Record<
  BrandMarkSize,
  { mark: number; layout: "inline" | "stack" }
> = {
  header: { mark: 24, layout: "inline" },
  page: { mark: 48, layout: "stack" },
  splash: { mark: 56, layout: "stack" },
};

interface BrandMarkProps {
  size: BrandMarkSize;
  /** When false, only the logo shows (still labeled Ridgeway for a11y). */
  showWordmark?: boolean;
  textClassName?: string;
  textStyle?: StyleProp<TextStyle>;
  className?: string;
  accessibilityRole?: AccessibilityRole;
}

const BrandMark: React.FC<BrandMarkProps> = ({
  size,
  showWordmark = true,
  textClassName,
  textStyle,
  className,
  accessibilityRole,
}) => {
  const { mark, layout } = SIZE_CONFIG[size];
  const Stack = layout === "stack" ? VStack : HStack;

  return (
    <Stack
      spacing="sm"
      align="center"
      className={cn(className)}
      accessible
      accessibilityLabel="Ridgeway"
      accessibilityRole={accessibilityRole}
    >
      <Image
        source={ASSETS.icons.logo}
        style={{ width: mark, height: mark }}
        contentFit="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      {showWordmark ? (
        <Text className={textClassName} style={textStyle} accessible={false}>
          Ridgeway
        </Text>
      ) : null}
    </Stack>
  );
};

export default BrandMark;
