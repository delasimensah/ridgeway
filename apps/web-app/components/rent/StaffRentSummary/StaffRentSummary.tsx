"use client";

import { Box } from "@mantine/core";
import React from "react";
import { type Currency, formatMoney } from "shared";

import Text from "../../ui/Text/Text";

interface StaffRentSummaryProps {
  collected: number;
  outstanding: number;
  currency: Currency;
  layout?: "split" | "stack";
}

const STACK_LABEL =
  "mb-1 text-sm font-medium uppercase tracking-wider text-grey";
const SPLIT_LABEL =
  "mb-2 text-[13px] font-bold uppercase tracking-wider text-grey";
const STACK_AMOUNT = "text-[32px] font-bold";
const SPLIT_AMOUNT = "text-[32px] font-bold md:text-[42px]";

const StaffRentSummary: React.FC<StaffRentSummaryProps> = ({
  collected,
  outstanding,
  currency,
  layout = "split",
}) => {
  const isStack = layout === "stack";
  const labelClass = isStack ? STACK_LABEL : SPLIT_LABEL;
  const amountClass = isStack ? STACK_AMOUNT : SPLIT_AMOUNT;

  return (
    <Box
      className={
        isStack
          ? "flex flex-col gap-6 rounded-[8px] border border-border bg-white p-8 shadow-card"
          : "flex flex-col gap-8 rounded-[8px] border border-border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-24 sm:p-10"
      }
    >
      <Box>
        <Text className={labelClass}>Collected</Text>
        <Text className={`${amountClass} text-darkGrey`}>
          {formatMoney(collected, currency)}
        </Text>
      </Box>
      <Box
        className={
          isStack
            ? "h-px w-full bg-border"
            : "hidden h-16 w-px bg-border sm:block"
        }
      />
      <Box>
        <Text className={labelClass}>Outstanding</Text>
        <Text className={`${amountClass} text-accent`}>
          {formatMoney(outstanding, currency)}
        </Text>
      </Box>
    </Box>
  );
};

export default StaffRentSummary;
