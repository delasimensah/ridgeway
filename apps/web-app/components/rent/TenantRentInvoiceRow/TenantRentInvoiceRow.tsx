"use client";

import { Box, Button } from "@mantine/core";
import React from "react";
import {
  type Currency,
  formatDateString,
  formatMoney,
  formatPeriodLabel,
  formatRentPartialLine,
  getRentDisplayStatus,
  type RentConfirmedStatus,
} from "shared";

import Text from "../../ui/Text/Text";
import RentStatusBadge from "../RentStatusBadge/RentStatusBadge";

interface TenantRentInvoiceRowProps {
  periodLabel: string;
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
  confirmedAmount: number | null;
  tenantReportedAt: number | null;
  serverNow: number;
  isReporting?: boolean;
  onReport: () => void;
}

const TenantRentInvoiceRow: React.FC<TenantRentInvoiceRowProps> = ({
  periodLabel,
  amount,
  currency,
  dueOn,
  confirmedStatus,
  confirmedAmount,
  tenantReportedAt,
  serverNow,
  isReporting = false,
  onReport,
}) => {
  const status = getRentDisplayStatus({ confirmedStatus, dueOn }, serverNow);
  const canReport = confirmedStatus === "unpaid" && tenantReportedAt === null;
  const awaitingStaff =
    confirmedStatus === "unpaid" && tenantReportedAt !== null;

  return (
    <Box className="flex flex-col gap-4 rounded-[8px] border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <Box>
          <Text className="mb-1 text-[12px] font-bold uppercase tracking-wider text-grey">
            Month
          </Text>
          <Text className="font-semibold text-darkGrey">
            {formatPeriodLabel(periodLabel)}
          </Text>
        </Box>
        <Box>
          <Text className="mb-1 text-[12px] font-bold uppercase tracking-wider text-grey">
            Amount
          </Text>
          <Text className="text-lg font-bold text-darkGrey">
            {formatMoney(amount, currency)}
          </Text>
          {confirmedStatus === "partial" ? (
            <Text className="mt-1 text-sm text-grey">
              {formatRentPartialLine(amount, confirmedAmount, currency)}
            </Text>
          ) : null}
        </Box>
        <Box>
          <Text className="mb-1 text-[12px] font-bold uppercase tracking-wider text-grey">
            Due date
          </Text>
          <Text className="font-medium text-darkGrey">
            {formatDateString(dueOn, "d MMM yyyy")}
          </Text>
        </Box>
      </Box>
      <Box className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
        <RentStatusBadge status={status} />
        {canReport ? (
          <Button
            onClick={onReport}
            loading={isReporting}
            className="h-auto rounded-[8px] bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primaryHover"
          >
            I have paid
          </Button>
        ) : awaitingStaff ? (
          <Text className="text-sm font-medium text-grey">Reported</Text>
        ) : null}
      </Box>
    </Box>
  );
};

export default TenantRentInvoiceRow;
