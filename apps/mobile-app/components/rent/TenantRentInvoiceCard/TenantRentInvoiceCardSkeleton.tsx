import React from "react";

import SkeletonCard from "../../ui/SkeletonCard/SkeletonCard";
import { HStack, VStack } from "../../ui/Stack/Stack";

const TenantRentInvoiceCardSkeleton: React.FC = () => {
  return (
    <VStack
      spacing="md"
      className="rounded-lg border border-border bg-white p-5"
    >
      <HStack align="start" justify="between">
        <VStack spacing="none">
          <SkeletonCard width={140} height={20} radius={4} mb={8} />
          <SkeletonCard width={120} height={14} radius={4} />
        </VStack>
        <SkeletonCard width={64} height={24} radius={12} />
      </HStack>
      <HStack
        align="center"
        justify="between"
        className="border-y border-border py-4"
      >
        <SkeletonCard width={96} height={16} radius={4} />
        <SkeletonCard width={88} height={24} radius={4} />
      </HStack>
      <SkeletonCard width={280} height={48} radius={8} />
    </VStack>
  );
};

export default TenantRentInvoiceCardSkeleton;
