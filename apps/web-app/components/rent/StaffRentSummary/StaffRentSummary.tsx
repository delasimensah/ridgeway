"use client";

import { Box } from "@mantine/core";
import React from "react";
import { type Currency, formatMoney } from "shared";

import Text from "../../ui/Text/Text";

interface StaffRentSummaryProps {
  collected: number;
  outstanding: number;
  currency: Currency;
}

const StaffRentSummary: React.FC<StaffRentSummaryProps> = ({
  collected,
  outstanding,
  currency,
}) => {
  return (
    <Box className="flex flex-col gap-8 rounded-[8px] border border-border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-24 sm:p-10">
      <Box>
        <Text className="mb-2 text-[13px] font-bold uppercase tracking-wider text-grey">
          Collected
        </Text>
        <Text className="text-[32px] font-bold text-darkGrey md:text-[42px]">
          {formatMoney(collected, currency)}
        </Text>
      </Box>
      <Box className="hidden h-16 w-px bg-border sm:block" />
      <Box>
        <Text className="mb-2 text-[13px] font-bold uppercase tracking-wider text-grey">
          Outstanding
        </Text>
        <Text className="text-[32px] font-bold text-accent md:text-[42px]">
          {formatMoney(outstanding, currency)}
        </Text>
      </Box>
    </Box>
  );
};

export default StaffRentSummary;
