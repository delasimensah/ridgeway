import React from "react";

import SkeletonCard from "../../../ui/SkeletonCard/SkeletonCard";
import { HStack, VStack } from "../../../ui/Stack/Stack";

const JobDetailScreenSkeleton: React.FC = () => {
  return (
    <VStack
      spacing="lg"
      padding="md"
      accessible
      accessibilityLabel="Loading job"
    >
      <HStack align="start" justify="between">
        <SkeletonCard width={180} height={24} radius={4} />
        <SkeletonCard width={64} height={24} radius={12} />
      </HStack>
      <VStack spacing="none">
        <SkeletonCard width={160} height={16} radius={4} mb={8} />
        <SkeletonCard width={112} height={16} radius={4} />
      </VStack>
      <VStack
        spacing="sm"
        className="rounded-lg border border-border bg-sidebar p-4"
      >
        <SkeletonCard width={96} height={12} radius={4} mb={8} />
        <SkeletonCard width={220} height={16} radius={4} mb={8} />
        <SkeletonCard width={160} height={16} radius={4} />
      </VStack>
    </VStack>
  );
};

export default JobDetailScreenSkeleton;
