import React from "react";

import { useAppInsets } from "@/hooks";

import SkeletonCard from "../../../ui/SkeletonCard/SkeletonCard";
import { HStack, VStack } from "../../../ui/Stack/Stack";

const TenantRepairTimelineScreenSkeleton: React.FC = () => {
  const insets = useAppInsets();

  return (
    <VStack
      spacing="none"
      className="flex-1 bg-white"
      accessible
      accessibilityLabel="Loading repair"
    >
      <HStack
        align="center"
        justify="between"
        paddingX="md"
        className="border-b border-border"
        style={{ paddingTop: insets.top + 8, paddingBottom: 16 }}
      >
        <SkeletonCard width={22} height={22} radius={4} />
        <SkeletonCard width={160} height={20} radius={4} />
        <VStack spacing="none" className="h-10 w-10" />
      </HStack>
      <VStack spacing="lg" padding="md">
        <HStack align="start" justify="between">
          <SkeletonCard width={140} height={24} radius={4} />
          <SkeletonCard width={64} height={24} radius={12} />
        </HStack>
        <VStack spacing="xl">
          <HStack spacing="md" align="start">
            <SkeletonCard width={32} height={32} radius={16} />
            <VStack spacing="sm" className="flex-1 pt-1">
              <SkeletonCard width={96} height={16} radius={4} />
              <SkeletonCard width={200} height={14} radius={4} />
            </VStack>
          </HStack>
          <HStack spacing="md" align="start">
            <SkeletonCard width={32} height={32} radius={16} />
            <VStack spacing="sm" className="flex-1 pt-1">
              <SkeletonCard width={88} height={16} radius={4} />
              <SkeletonCard width={180} height={14} radius={4} />
            </VStack>
          </HStack>
          <HStack spacing="md" align="start">
            <SkeletonCard width={32} height={32} radius={16} />
            <VStack spacing="sm" className="flex-1 pt-1">
              <SkeletonCard width={104} height={16} radius={4} />
              <SkeletonCard width={160} height={14} radius={4} />
            </VStack>
          </HStack>
          <HStack spacing="md" align="start">
            <SkeletonCard width={32} height={32} radius={16} />
            <VStack spacing="sm" className="flex-1 pt-1">
              <SkeletonCard width={72} height={16} radius={4} />
              <SkeletonCard width={170} height={14} radius={4} />
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default TenantRepairTimelineScreenSkeleton;
