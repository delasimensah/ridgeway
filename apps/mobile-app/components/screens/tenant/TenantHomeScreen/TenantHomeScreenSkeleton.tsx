import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TenantRepairCardSkeleton from "../../../repairs/TenantRepairCard/TenantRepairCardSkeleton";
import SkeletonCard from "../../../ui/SkeletonCard/SkeletonCard";
import { HStack, VStack } from "../../../ui/Stack/Stack";

const TenantHomeScreenSkeleton: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <VStack
      spacing="none"
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 8 }}
      accessible
      accessibilityLabel="Loading home"
    >
      <VStack spacing="sm" paddingX="md" className="pb-2 pt-3">
        <HStack align="center" justify="between">
          <SkeletonCard width={24} height={24} radius={4} />
          <SkeletonCard width={32} height={32} radius={16} />
        </HStack>
        <SkeletonCard width={200} height={28} radius={4} mb={8} />
        <SkeletonCard width={240} height={14} radius={4} />
      </VStack>
      <VStack spacing="md" paddingX="md" paddingY="sm">
        <VStack
          spacing="sm"
          className="rounded-lg border border-border bg-white p-4"
        >
          <HStack align="start" justify="between">
            <SkeletonCard width={80} height={13} radius={4} />
            <SkeletonCard width={64} height={24} radius={12} />
          </HStack>
          <SkeletonCard width={120} height={28} radius={4} />
          <SkeletonCard width={140} height={14} radius={4} />
          <SkeletonCard width={280} height={44} radius={8} />
        </VStack>
        <HStack align="center" justify="between" className="pt-2">
          <SkeletonCard width={120} height={14} radius={4} />
          <SkeletonCard width={96} height={14} radius={4} />
        </HStack>
        <TenantRepairCardSkeleton />
        <TenantRepairCardSkeleton />
      </VStack>
    </VStack>
  );
};

export default TenantHomeScreenSkeleton;
