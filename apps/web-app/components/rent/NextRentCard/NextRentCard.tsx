"use client";

import { Box } from "@mantine/core";
import React from "react";
import {
  type Currency,
  formatDateString,
  formatMoney,
  formatRentPartialLine,
  getRentDisplayStatus,
  type RentConfirmedStatus,
} from "shared";

import Text from "../../ui/Text/Text";
import RentStatusBadge from "../RentStatusBadge/RentStatusBadge";

interface NextRentCardProps {
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
  confirmedAmount?: number | null;
  serverNow: number;
}

const NextRentCard: React.FC<NextRentCardProps> = ({
  amount,
  currency,
  dueOn,
  confirmedStatus,
  confirmedAmount = null,
  serverNow,
}) => {
  const status = getRentDisplayStatus({ confirmedStatus, dueOn }, serverNow);

  return (
    <Box className="rounded-[8px] border border-border bg-white p-6 shadow-sm">
      <Box className="flex items-start justify-between">
        <Box>
          <Text className="mb-1 text-[24px] font-bold text-darkGrey">
            {formatMoney(amount, currency)}
          </Text>
          <Text className="text-sm text-grey">
            Due {formatDateString(dueOn, "d MMM yyyy")}
          </Text>
          {confirmedStatus === "partial" ? (
            <Text className="mt-1 text-sm text-grey">
              {formatRentPartialLine(amount, confirmedAmount, currency)}
            </Text>
          ) : null}
        </Box>
        <RentStatusBadge status={status} />
      </Box>
    </Box>
  );
};

export default NextRentCard;
