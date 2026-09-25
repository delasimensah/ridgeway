import React from "react";
import { ActivityIndicator } from "react-native";

import { COLORS } from "@/constants";

import BrandMark from "../../ui/BrandMark/BrandMark";
import { VStack } from "../../ui/Stack/Stack";

const RoleWaitScreen: React.FC = () => {
  return (
    <VStack
      align="center"
      justify="center"
      spacing="lg"
      className="flex-1 bg-accent"
    >
      <BrandMark
        size="splash"
        showWordmark={false}
        accessibilityRole="header"
      />
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        accessibilityLabel="Loading"
      />
    </VStack>
  );
};

export default RoleWaitScreen;
