"use client";

import { Box, Stack } from "@mantine/core";
import React from "react";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface OwnerBuildingCardProps {
  name: string;
  address: string;
}

const OwnerBuildingCard: React.FC<OwnerBuildingCardProps> = ({
  name,
  address,
}) => {
  return (
    <Box className="rounded-[8px] border border-border bg-white p-6 shadow-sm">
      <Stack gap={4}>
        <Heading
          variant="card"
          className="mb-0 text-[18px] font-bold text-darkGrey"
        >
          {name}
        </Heading>
        <Text className="text-[14px] text-grey">{address}</Text>
      </Stack>
    </Box>
  );
};

export default OwnerBuildingCard;
