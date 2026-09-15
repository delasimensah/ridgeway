import { Box, Stack } from "@mantine/core";
import React from "react";

import Skeleton from "../../ui/Skeleton/Skeleton";

const PageContentSkeleton: React.FC = () => {
  return (
    <Box aria-busy="true" aria-label="Loading page" className="max-w-[1200px]">
      <Stack gap="md">
        <Skeleton height={36} width={240} />
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="80%" />
        <Skeleton height={48} width="100%" />
      </Stack>
    </Box>
  );
};

export default PageContentSkeleton;
