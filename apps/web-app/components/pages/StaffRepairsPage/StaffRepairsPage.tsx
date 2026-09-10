"use client";

import { Box } from "@mantine/core";
import React from "react";

import RepairListTable, {
  type RepairListItem,
} from "../../repairs/RepairListTable/RepairListTable";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffRepairsPageProps {
  repairs: RepairListItem[];
}

const StaffRepairsPage: React.FC<StaffRepairsPageProps> = ({ repairs }) => {
  return (
    <Box className="max-w-[1200px]">
      <Heading
        variant="page"
        className="mb-6 text-[24px] font-bold text-darkGrey sm:mb-8 sm:text-[28px] md:text-[32px]"
      >
        Repairs
      </Heading>
      {repairs.length === 0 ? (
        <Text className="text-base text-grey">No open repairs.</Text>
      ) : (
        <RepairListTable repairs={repairs} />
      )}
    </Box>
  );
};

export default StaffRepairsPage;
