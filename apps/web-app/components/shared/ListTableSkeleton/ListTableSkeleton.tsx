import { Box } from "@mantine/core";
import React from "react";

import Skeleton from "../../ui/Skeleton/Skeleton";

interface ListTableSkeletonProps {
  label?: string;
}

const ROW_COUNT = 4;
const COLUMN_WIDTHS = [96, 192, 64, 96];

const ListTableSkeleton: React.FC<ListTableSkeletonProps> = ({
  label = "Loading list",
}) => {
  return (
    <Box
      aria-busy="true"
      aria-label={label}
      className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm"
    >
      <Box className="flex gap-8 border-b border-border bg-sidebar px-4 py-3 sm:px-6 sm:py-4">
        {COLUMN_WIDTHS.map((width, columnIndex) => (
          <Skeleton key={columnIndex} height={16} width={width} />
        ))}
      </Box>
      <Box className="divide-y divide-border">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <Box key={index} className="flex gap-8 px-4 py-5 sm:px-6 sm:py-6">
            {COLUMN_WIDTHS.map((width, columnIndex) => (
              <Skeleton key={columnIndex} height={20} width={width} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ListTableSkeleton;
