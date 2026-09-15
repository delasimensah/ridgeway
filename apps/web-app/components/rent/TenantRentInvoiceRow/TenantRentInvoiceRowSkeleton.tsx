import { Box } from "@mantine/core";
import React from "react";

import Skeleton from "../../ui/Skeleton/Skeleton";

const TenantRentInvoiceRowSkeleton: React.FC = () => {
  return (
    <Box className="flex flex-col gap-4 rounded-[8px] border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <Box>
          <Skeleton height={12} width={48} className="mb-2" />
          <Skeleton height={16} width={112} />
        </Box>
        <Box>
          <Skeleton height={12} width={56} className="mb-2" />
          <Skeleton height={20} width={88} />
        </Box>
        <Box>
          <Skeleton height={12} width={64} className="mb-2" />
          <Skeleton height={16} width={96} />
        </Box>
      </Box>
      <Skeleton height={24} width={72} radius="xl" />
    </Box>
  );
};

export default TenantRentInvoiceRowSkeleton;
