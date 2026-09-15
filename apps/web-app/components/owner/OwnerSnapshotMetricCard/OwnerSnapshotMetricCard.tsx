"use client";

import { Box } from "@mantine/core";
import React from "react";
import { cn } from "shared";

import Text from "../../ui/Text/Text";

interface OwnerSnapshotMetricCardProps {
  label: string;
  value: string;
  hint?: string;
  valueClassName?: string;
}

const OwnerSnapshotMetricCard: React.FC<OwnerSnapshotMetricCardProps> = ({
  label,
  value,
  hint,
  valueClassName,
}) => {
  return (
    <Box className="rounded-[8px] border border-border bg-white p-6 shadow-sm">
      <Text className="mb-1 text-sm font-medium text-grey">{label}</Text>
      {hint === undefined ? (
        <Text
          className={cn("text-[28px] font-bold text-darkGrey", valueClassName)}
        >
          {value}
        </Text>
      ) : (
        <Box className="flex items-baseline gap-2">
          <Text
            className={cn(
              "text-[28px] font-bold text-darkGrey",
              valueClassName
            )}
          >
            {value}
          </Text>
          <Text className="text-base text-grey">{hint}</Text>
        </Box>
      )}
    </Box>
  );
};

export default OwnerSnapshotMetricCard;
