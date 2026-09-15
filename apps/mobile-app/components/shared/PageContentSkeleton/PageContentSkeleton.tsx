import React from "react";

import SkeletonCard from "../../ui/SkeletonCard/SkeletonCard";
import { VStack } from "../../ui/Stack/Stack";

const PageContentSkeleton: React.FC = () => {
  return (
    <VStack
      spacing="md"
      padding="md"
      className="flex-1"
      accessible
      accessibilityLabel="Loading page"
    >
      <SkeletonCard width={160} height={28} radius={4} />
      <SkeletonCard width={220} height={16} radius={4} />
      <SkeletonCard width={180} height={16} radius={4} />
      <SkeletonCard width={240} height={48} radius={8} />
    </VStack>
  );
};

export default PageContentSkeleton;
