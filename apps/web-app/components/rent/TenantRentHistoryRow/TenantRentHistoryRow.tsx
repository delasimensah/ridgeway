"use client";

import { Box } from "@mantine/core";
import React from "react";
import {
  type Currency,
  formatMoney,
  formatPeriodLabel,
  type RentStatus,
  rentStatusLabel,
} from "shared";

import Text from "../../ui/Text/Text";

interface TenantRentHistoryRowProps {
  periodLabel: string;
  amount: number;
  currency: Currency;
  status: RentStatus;
}

const TenantRentHistoryRow: React.FC<TenantRentHistoryRowProps> = ({
  periodLabel,
  amount,
  currency,
  status,
}) => {
  return (
    <Box className="flex items-center justify-between border-b border-border py-4">
      <Text className="font-medium text-darkGrey">
        {formatPeriodLabel(periodLabel)}
      </Text>
      <Box className="flex items-center gap-4">
        <Text className="text-grey">{formatMoney(amount, currency)}</Text>
        <Text className="text-[12px] font-bold uppercase text-darkGrey">
          {rentStatusLabel(status)}
        </Text>
      </Box>
    </Box>
  );
};

export default TenantRentHistoryRow;
