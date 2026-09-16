import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TenantRepairCardSkeleton from "../../../repairs/TenantRepairCard/TenantRepairCardSkeleton";
import SkeletonCard from "../../../ui/SkeletonCard/SkeletonCard";
import { HStack, VStack } from "../../../ui/Stack/Stack";

const TenantRepairsScreenSkeleton: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <VStack
      spacing="none"
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 8 }}
      accessible
      accessibilityLabel="Loading repairs"
    >
      <HStack
        align="center"
        justify="between"
        paddingX="md"
        className="pb-2 pt-3"
      >
        <SkeletonCard width={112} height={28} radius={4} />
        <SkeletonCard width={96} height={16} radius={4} />
      </HStack>
      <VStack spacing="sm" paddingX="md" paddingY="sm">
        <TenantRepairCardSkeleton />
        <TenantRepairCardSkeleton />
      </VStack>
    </VStack>
  );
};

export default TenantRepairsScreenSkeleton;
