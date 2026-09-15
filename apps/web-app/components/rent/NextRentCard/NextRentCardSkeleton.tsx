import { Box } from "@mantine/core";
import React from "react";

import Skeleton from "../../ui/Skeleton/Skeleton";

const NextRentCardSkeleton: React.FC = () => {
  return (
    <Box
      aria-busy="true"
      aria-label="Loading next rent"
      className="rounded-[8px] border border-border bg-white p-6 shadow-sm"
    >
      <Box className="flex items-start justify-between">
        <Box>
          <Skeleton height={28} width={140} className="mb-2" />
          <Skeleton height={14} width={120} />
        </Box>
        <Skeleton height={24} width={64} radius="xl" />
      </Box>
    </Box>
  );
};

export default NextRentCardSkeleton;
