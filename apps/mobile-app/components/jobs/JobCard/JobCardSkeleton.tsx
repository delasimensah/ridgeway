import React from "react";

import SkeletonCard from "../../ui/SkeletonCard/SkeletonCard";
import { HStack, VStack } from "../../ui/Stack/Stack";

const JobCardSkeleton: React.FC = () => {
  return (
    <VStack
      spacing="sm"
      className="rounded-lg border border-border bg-white p-3"
    >
      <HStack align="start" justify="between">
        <VStack spacing="none">
          <SkeletonCard width={128} height={12} radius={4} mb={8} />
          <SkeletonCard width={192} height={20} radius={4} />
        </VStack>
        <SkeletonCard width={64} height={24} radius={12} />
      </HStack>
      <SkeletonCard width={160} height={12} radius={4} />
    </VStack>
  );
};

export default JobCardSkeleton;
