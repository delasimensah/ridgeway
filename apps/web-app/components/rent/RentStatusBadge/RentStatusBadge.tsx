"use client";

import { Box } from "@mantine/core";
import React from "react";
import { cn, type RentStatus, rentStatusLabel } from "shared";

interface RentStatusBadgeProps {
  status: RentStatus;
}

const STATUS_CLASS: Record<RentStatus, string> = {
  paid: "border border-border bg-sidebar text-darkGrey",
  due: "border border-border bg-white text-grey",
  late: "bg-overdue text-white",
  partial: "border border-border bg-sidebar text-darkGrey",
};

const RentStatusBadge: React.FC<RentStatusBadgeProps> = ({ status }) => {
  return (
    <Box
      component="span"
      className={cn(
        "rounded-full px-3 py-1 text-[12px] font-bold uppercase",
        STATUS_CLASS[status]
      )}
    >
      {rentStatusLabel(status)}
    </Box>
  );
};

export default RentStatusBadge;
