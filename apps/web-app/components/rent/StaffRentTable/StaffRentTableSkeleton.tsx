import { Box } from "@mantine/core";
import React from "react";

import Skeleton from "../../ui/Skeleton/Skeleton";

const ROW_COUNT = 4;

const StaffRentTableSkeleton: React.FC = () => {
  return (
    <Box
      aria-busy="true"
      aria-label="Loading rent list"
      className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm"
    >
      <Box className="flex gap-8 border-b border-border bg-sidebar px-4 py-3 sm:px-6 sm:py-4">
        <Skeleton height={14} width={48} />
        <Skeleton height={14} width={72} />
        <Skeleton height={14} width={96} />
        <Skeleton height={14} width={64} />
      </Box>
      <Box className="divide-y divide-border">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <Box key={index} className="flex gap-8 px-4 py-4 sm:px-6 sm:py-5">
            <Skeleton height={18} width={40} />
            <Skeleton height={18} width={128} />
            <Skeleton height={18} width={88} />
            <Skeleton height={18} width={72} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StaffRentTableSkeleton;
