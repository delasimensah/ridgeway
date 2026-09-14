"use client";

import { Box, Select, Table } from "@mantine/core";
import React from "react";
import {
  type Currency,
  formatDate,
  formatDateString,
  formatMoney,
  getRentDisplayStatus,
  type RentConfirmedStatus,
} from "shared";

import Text from "../../ui/Text/Text";
import RentStatusBadge from "../RentStatusBadge/RentStatusBadge";

export const CONFIRMED_STATUS_OPTIONS = [
  { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" },
  { value: "unpaid", label: "Not paid" },
] as const;

interface StaffRentRowProps {
  unitLabel: string;
  tenantName: string;
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
  confirmedAmount: number | null;
  tenantReportedAt: number | null;
  serverNow: number;
  onSetStatus: (confirmedStatus: "paid" | "unpaid") => void;
  onRequestPartial: () => void;
}

const TD = "px-4 py-4 text-[15px] text-darkGrey sm:px-6 sm:py-5";
const LABEL_TD = "px-4 py-4 font-bold text-darkGrey sm:px-6 sm:py-5";

const StaffRentRow: React.FC<StaffRentRowProps> = ({
  unitLabel,
  tenantName,
  amount,
  currency,
  dueOn,
  confirmedStatus,
  confirmedAmount,
  tenantReportedAt,
  serverNow,
  onSetStatus,
  onRequestPartial,
}) => {
  const status = getRentDisplayStatus({ confirmedStatus, dueOn }, serverNow);
  const outstanding =
    confirmedStatus === "partial" ? amount - (confirmedAmount ?? 0) : 0;
  const isAwaitingConfirmation =
    tenantReportedAt !== null && confirmedStatus !== "paid";

  return (
    <Table.Tr className="hover:bg-sidebar">
      <Table.Td className={LABEL_TD}>{unitLabel}</Table.Td>
      <Table.Td className={TD}>{tenantName}</Table.Td>
      <Table.Td className={TD}>
        <Text className="font-semibold text-darkGrey">
          {formatMoney(amount, currency)}
        </Text>
        <Text className="mt-1 text-[13px] text-grey">
          {`Due ${formatDateString(dueOn, "d MMM yyyy")}`}
        </Text>
        {confirmedStatus === "partial" ? (
          <Text className="mt-1 text-[13px] text-grey">
            {`${formatMoney(confirmedAmount ?? 0, currency)} received · ${formatMoney(outstanding, currency)} still owed`}
          </Text>
        ) : null}
      </Table.Td>
      <Table.Td className={TD}>
        <Box className="flex flex-col items-start gap-2">
          <Box className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            <RentStatusBadge status={status} />
            <Select
              aria-label={`Confirm rent for ${unitLabel}`}
              value={confirmedStatus}
              data={[...CONFIRMED_STATUS_OPTIONS]}
              allowDeselect={false}
              pointer
              comboboxProps={{ shadow: "sm" }}
              onChange={(value) => {
                if (value === "partial") {
                  onRequestPartial();
                  return;
                }
                if (value === "paid" || value === "unpaid") {
                  onSetStatus(value);
                }
              }}
              classNames={{
                input:
                  "min-h-9 w-[8.5rem] rounded-[4px] border-border bg-sidebar text-[12px] font-bold uppercase text-darkGrey",
                dropdown: "rounded-[8px] border border-border bg-white",
                option:
                  "rounded-[6px] text-[12px] font-bold uppercase text-darkGrey bg-white hover:bg-sidebar data-[combobox-selected]:bg-sidebar data-[combobox-active]:bg-sidebar",
              }}
            />
          </Box>
          {isAwaitingConfirmation ? (
            <Text className="text-[13px] font-semibold text-primary">
              {`Tenant reported payment on ${formatDate(new Date(tenantReportedAt), "d MMM yyyy")} · confirm it`}
            </Text>
          ) : null}
        </Box>
      </Table.Td>
    </Table.Tr>
  );
};

export default StaffRentRow;
