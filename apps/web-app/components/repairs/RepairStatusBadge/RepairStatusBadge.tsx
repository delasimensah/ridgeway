"use client";

import { Box } from "@mantine/core";
import React from "react";
import type { WorkOrderStatus } from "shared";
import { cn } from "shared";

import { repairStatusLabel } from "@/utils";

interface RepairStatusBadgeProps {
  status: WorkOrderStatus;
}

const DOT_CLASS: Record<WorkOrderStatus, string> = {
  received: "bg-dotBlue",
  assigned: "bg-dotTeal",
  scheduled: "bg-dotGold",
  done: "bg-dotGreen",
};

const RepairStatusBadge: React.FC<RepairStatusBadgeProps> = ({ status }) => {
  return (
    <Box
      component="span"
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1 text-[12px] font-medium text-darkGrey"
    >
      <Box
        component="span"
        aria-hidden
        className={cn("h-2 w-2 rounded-full", DOT_CLASS[status])}
      />
      {repairStatusLabel(status)}
    </Box>
  );
};

export default RepairStatusBadge;
