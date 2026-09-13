import React from "react";

import JobCardSkeleton from "../../../jobs/JobCard/JobCardSkeleton";
import SkeletonCard from "../../../ui/SkeletonCard/SkeletonCard";
import { VStack } from "../../../ui/Stack/Stack";

const JobsScreenSkeleton: React.FC = () => {
  return (
    <VStack
      spacing="none"
      className="flex-1"
      accessible
      accessibilityLabel="Loading jobs"
    >
      <VStack spacing="sm" paddingX="md" paddingY="sm">
        <SkeletonCard width={96} height={16} radius={4} />
        <SkeletonCard width={160} height={32} radius={4} />
      </VStack>
      <VStack spacing="md" padding="md">
        <JobCardSkeleton />
        <JobCardSkeleton />
      </VStack>
    </VStack>
  );
};

export default JobsScreenSkeleton;
