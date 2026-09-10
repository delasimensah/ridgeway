"use client";

import { Box } from "@mantine/core";
import React from "react";
import type { WorkOrderStatus } from "shared";
import { cn } from "shared";

import { repairStatusLabel } from "@/utils";

interface RepairStatusBadgeProps {
  status: WorkOrderStatus;
}

const STATUS_CLASS: Record<WorkOrderStatus, string> = {
  received: "bg-grey text-white",
  assigned: "bg-primaryHover text-white",
  scheduled: "bg-accent text-darkGrey",
  done: "border border-border bg-sidebar text-darkGrey",
};

const RepairStatusBadge: React.FC<RepairStatusBadgeProps> = ({ status }) => {
  return (
    <Box
      component="span"
      className={cn(
        "rounded-full px-3 py-1 text-[12px] font-bold uppercase",
        STATUS_CLASS[status]
      )}
    >
      {repairStatusLabel(status)}
    </Box>
  );
};

export default RepairStatusBadge;
