"use client";

import { Box, SimpleGrid } from "@mantine/core";
import React from "react";
import { type Currency, formatMoney } from "shared";

import Text from "../../ui/Text/Text";

interface OwnerRentTotalsProps {
  collected: number;
  outstanding: number;
  currency: Currency;
}

function collectedPercent(collected: number, outstanding: number): number {
  const total = collected + outstanding;
  if (total === 0) {
    return 0;
  }
  return Math.round((collected / total) * 100);
}

const OwnerRentTotals: React.FC<OwnerRentTotalsProps> = ({
  collected,
  outstanding,
  currency,
}) => {
  const percent = collectedPercent(collected, outstanding);

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: "md", md: 32 }}>
      <Box className="rounded-[8px] border border-border bg-white p-6 shadow-sm sm:p-8">
        <Text className="mb-1 text-sm font-medium uppercase tracking-wider text-grey">
          Collected
        </Text>
        <Text className="text-[32px] font-bold text-darkGrey sm:text-[48px]">
          {formatMoney(collected, currency)}
        </Text>
        <Box className="mt-4 flex items-center gap-2">
          <Box className="h-2 flex-1 overflow-hidden rounded-full bg-sidebar">
            <Box
              className="h-full bg-primary"
              style={{ width: `${percent}%` }}
            />
          </Box>
          <Text className="text-sm font-bold text-darkGrey">{`${percent}%`}</Text>
        </Box>
      </Box>
      <Box className="rounded-[8px] border border-border bg-white p-6 shadow-sm sm:p-8">
        <Text className="mb-1 text-sm font-medium uppercase tracking-wider text-accent">
          Outstanding
        </Text>
        <Text className="text-[32px] font-bold text-accent sm:text-[48px]">
          {formatMoney(outstanding, currency)}
        </Text>
        <Text className="mt-4 text-sm text-grey">Expected by end of month</Text>
      </Box>
    </SimpleGrid>
  );
};

export default OwnerRentTotals;
