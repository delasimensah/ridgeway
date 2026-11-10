"use client";

import { Box } from "@mantine/core";
import React from "react";

import { DEMO_LOCK_MESSAGE } from "@/utils";

import Text from "../../ui/Text/Text";

const WritesLockedNote: React.FC = () => {
  return (
    <Box
      role="status"
      className="mb-6 rounded-[8px] border border-border bg-white px-4 py-3"
    >
      <Text className="text-sm text-darkGrey">{DEMO_LOCK_MESSAGE}</Text>
    </Box>
  );
};

export default WritesLockedNote;
