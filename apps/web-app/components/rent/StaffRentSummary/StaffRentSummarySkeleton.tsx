import { Box } from "@mantine/core";
import React from "react";

import Skeleton from "../../ui/Skeleton/Skeleton";

interface StaffRentSummarySkeletonProps {
  layout?: "split" | "stack";
}

const StaffRentSummarySkeleton: React.FC<StaffRentSummarySkeletonProps> = ({
  layout = "split",
}) => {
  const isStack = layout === "stack";

  return (
    <Box
      aria-busy="true"
      aria-label="Loading rent summary"
      className={
        isStack
          ? "flex flex-col gap-6 rounded-[8px] border border-border bg-white p-8 shadow-card"
          : "flex flex-col gap-8 rounded-[8px] border border-border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-24 sm:p-10"
      }
    >
      <Box>
        <Skeleton height={14} width={88} className="mb-3" />
        <Skeleton height={40} width={160} />
      </Box>
      <Box
        className={
          isStack
            ? "h-px w-full bg-border"
            : "hidden h-16 w-px bg-border sm:block"
        }
      />
      <Box>
        <Skeleton height={14} width={104} className="mb-3" />
        <Skeleton height={40} width={160} />
      </Box>
    </Box>
  );
};

export default StaffRentSummarySkeleton;
