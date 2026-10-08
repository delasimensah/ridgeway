"use client";

import { Box } from "@mantine/core";
import React from "react";
import { cn, type RentStatus, rentStatusLabel } from "shared";

interface RentStatusBadgeProps {
  status: RentStatus;
}

const DOT_CLASS: Record<RentStatus, string> = {
  paid: "bg-dotGreen",
  due: "bg-dotBlue",
  late: "bg-dotRed",
  partial: "bg-dotGold",
};

const RentStatusBadge: React.FC<RentStatusBadgeProps> = ({ status }) => {
  return (
    <Box
      component="span"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1 text-[12px] font-medium text-darkGrey"
    >
      <Box
        component="span"
        aria-hidden
        className={cn("h-2 w-2 rounded-full", DOT_CLASS[status])}
      />
      {rentStatusLabel(status)}
    </Box>
  );
};

export default RentStatusBadge;
