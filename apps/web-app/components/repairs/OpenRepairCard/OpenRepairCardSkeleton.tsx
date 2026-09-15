import { Box } from "@mantine/core";
import React from "react";

import Skeleton from "../../ui/Skeleton/Skeleton";

const OpenRepairCardSkeleton: React.FC = () => {
  return (
    <Box className="flex items-center justify-between gap-4 rounded-[8px] border border-border bg-white p-4 shadow-card">
      <Box>
        <Skeleton height={16} width={140} className="mb-2" />
        <Skeleton height={14} width={180} />
      </Box>
      <Skeleton height={24} width={88} radius="xl" />
    </Box>
  );
};

export default OpenRepairCardSkeleton;
