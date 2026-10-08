import { Box } from "@mantine/core";
import React from "react";

import Skeleton from "../../ui/Skeleton/Skeleton";

const StaffHomeMetricCardSkeleton: React.FC = () => {
  return (
    <Box className="rounded-[8px] border border-border bg-white p-6 shadow-card">
      <Skeleton height={36} width={36} className="mb-4 rounded-[8px]" />
      <Skeleton height={14} width={96} className="mb-3" />
      <Skeleton height={40} width={56} />
    </Box>
  );
};

export default StaffHomeMetricCardSkeleton;
