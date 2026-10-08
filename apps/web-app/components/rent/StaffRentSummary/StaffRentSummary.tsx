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
const STACK_AMOUNT =
  "text-[40px] font-semibold leading-none tracking-tight tabular-nums";
const SPLIT_AMOUNT =
  "text-[32px] font-semibold leading-none tracking-tight tabular-nums md:text-[42px]";

const StaffRentSummary: React.FC<StaffRentSummaryProps> = ({
  collected,
  outstanding,
  currency,
  layout = "split",
}) => {
  const isStack = layout === "stack";
  const labelClass = isStack ? STACK_LABEL : SPLIT_LABEL;
  const amountClass = isStack ? STACK_AMOUNT : SPLIT_AMOUNT;
  const total = collected + outstanding;
  const collectedPercent =
    total === 0 ? 0 : Math.round((collected / total) * 100);

  return (
    <Box
      className={
        isStack
          ? "flex flex-col gap-6 rounded-[8px] border border-border bg-white p-8 shadow-card"
          : "flex flex-col gap-8 rounded-[8px] border border-border bg-white p-6 shadow-sm sm:p-10"
      }
    >
      <Box
        className={
          isStack
            ? "flex flex-col gap-6"
            : "flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-24"
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
          <Text className={`${amountClass} text-accentInk`}>
            {formatMoney(outstanding, currency)}
          </Text>
        </Box>
      </Box>
      <Box>
        <Box className="h-1.5 overflow-hidden rounded-full bg-sidebar">
          <Box
            className="h-full rounded-full bg-primary"
            style={{ width: `${collectedPercent}%` }}
          />
        </Box>
        <Text className="mt-2 text-[13px] text-grey">{`${collectedPercent}% collected`}</Text>
      </Box>
    </Box>
  );
};

export default StaffRentSummary;
