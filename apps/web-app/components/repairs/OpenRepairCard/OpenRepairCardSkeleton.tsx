import { Box } from "@mantine/core";
import React from "react";

import Skeleton from "../../ui/Skeleton/Skeleton";

const OpenRepairCardSkeleton: React.FC = () => {
  return (
    <Box className="flex overflow-hidden rounded-[8px] border border-border bg-white shadow-card">
      <Box className="w-1 shrink-0 bg-border" />
      <Box className="flex min-w-0 flex-1 items-center justify-between gap-4 p-4">
        <Box>
          <Skeleton height={16} width={140} className="mb-2" />
          <Skeleton height={14} width={180} />
        </Box>
        <Skeleton height={24} width={88} radius="xl" />
      </Box>
    </Box>
  );
};

export default OpenRepairCardSkeleton;
