import React from "react";

import SkeletonCard from "../../ui/SkeletonCard/SkeletonCard";
import { HStack, VStack } from "../../ui/Stack/Stack";

const TenantRepairCardSkeleton: React.FC = () => {
  return (
    <VStack
      spacing="sm"
      className="rounded-lg border border-border bg-white p-4"
    >
      <HStack align="start" justify="between">
        <SkeletonCard width={180} height={16} radius={4} />
        <SkeletonCard width={64} height={24} radius={12} />
      </HStack>
      <SkeletonCard width={160} height={13} radius={4} />
      <SkeletonCard width={140} height={13} radius={4} />
    </VStack>
  );
};

export default TenantRepairCardSkeleton;
