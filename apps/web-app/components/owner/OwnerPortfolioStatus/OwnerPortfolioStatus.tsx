"use client";

import { Box, Button } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { type Currency, formatMoney } from "shared";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface OwnerPortfolioStatusProps {
  collected: number;
  outstanding: number;
  currency: Currency;
  buildingCount: number;
}

const PRIMARY_BUTTON =
  "h-auto w-full rounded-[8px] bg-primary px-6 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover sm:w-auto";

const OwnerPortfolioStatus: React.FC<OwnerPortfolioStatusProps> = ({
  collected,
  outstanding,
  currency,
  buildingCount,
}) => {
  const acrossLabel =
    buildingCount === 1
      ? "Across 1 building"
      : `Across ${buildingCount} buildings`;

  return (
    <Box component="section">
      <Heading
        variant="section"
        className="mb-6 text-[20px] font-bold text-darkGrey"
      >
        Portfolio status
      </Heading>
      <Box className="rounded-[8px] border border-border bg-white p-6 shadow-sm sm:p-8">
        <Box className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
          <Box className="flex-1">
            <Text className="mb-1 text-sm font-medium uppercase tracking-wider text-grey">
              Total Collected
            </Text>
            <Text className="text-[32px] font-semibold tabular-nums tracking-tight text-darkGrey md:text-[40px]">
              {formatMoney(collected, currency)}
            </Text>
            <Text className="mt-2 text-[13px] text-grey">Current month</Text>
          </Box>
          <Box className="hidden h-16 w-px bg-border md:block" />
          <Box className="flex-1">
            <Text className="mb-1 text-sm font-medium uppercase tracking-wider text-grey">
              Total Outstanding
            </Text>
            <Text className="text-[32px] font-semibold tabular-nums tracking-tight text-accentInk md:text-[40px]">
              {formatMoney(outstanding, currency)}
            </Text>
            <Text className="mt-2 text-[13px] text-grey">{acrossLabel}</Text>
          </Box>
          <Button component={Link} href="/rent" className={PRIMARY_BUTTON}>
            View Rent Details
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default OwnerPortfolioStatus;
