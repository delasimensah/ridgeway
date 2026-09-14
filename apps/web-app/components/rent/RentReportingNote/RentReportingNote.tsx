"use client";

import { Box } from "@mantine/core";
import React from "react";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

const RentReportingNote: React.FC = () => {
  return (
    <Box className="mt-8 rounded-[8px] border border-dashed border-border bg-sidebar/30 p-6">
      <Heading
        variant="card"
        className="mb-1 text-sm font-semibold text-darkGrey"
      >
        Payment reporting
      </Heading>
      <Text className="text-sm text-grey">
        Ridgeway staff still confirm this. Reporting your payment helps us track
        it faster, but your status will update once funds are verified.
      </Text>
    </Box>
  );
};

export default RentReportingNote;
