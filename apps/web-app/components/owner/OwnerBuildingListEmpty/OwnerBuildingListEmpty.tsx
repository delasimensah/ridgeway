"use client";

import { Box, Stack } from "@mantine/core";
import React from "react";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

const OwnerBuildingListEmpty: React.FC = () => {
  return (
    <Box className="flex min-h-[240px] flex-col items-center justify-center rounded-[8px] border border-dashed border-border bg-white p-6 text-center sm:min-h-[320px] sm:p-10 md:min-h-[400px] md:p-12">
      <Stack align="center" gap="md">
        <Heading variant="section" className="mb-0 text-[20px] font-bold">
          No buildings yet.
        </Heading>
        <Text className="max-w-[320px] text-grey">
          When Ridgeway attaches a building to you, it will show here. You will
          not see another owner&apos;s buildings.
        </Text>
      </Stack>
    </Box>
  );
};

export default OwnerBuildingListEmpty;
