"use client";

import { Box, Button, Group, Select } from "@mantine/core";
import React, { useState } from "react";
import {
  type Currency,
  formatPeriodLabel,
  getRentDisplayStatus,
  type RentConfirmedStatus,
} from "shared";

import ConfirmPartialRentModal from "../../rent/ConfirmPartialRentModal/ConfirmPartialRentModal";
import StaffRentSummary from "../../rent/StaffRentSummary/StaffRentSummary";
import StaffRentTable, {
  type StaffRentItem,
} from "../../rent/StaffRentTable/StaffRentTable";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

export type StaffRentFilter = "all" | "reported" | "late";

export interface StaffRentBuildingOption {
  _id: string;
  name: string;
}

interface StaffRentPageProps {
  periodLabel: string;
  buildings: StaffRentBuildingOption[];
  buildingId: string;
  onBuildingIdChange: (buildingId: string) => void;
  collected: number;
  outstanding: number;
  currency: Currency;
  periods: StaffRentItem[];
  serverNow: number;
  statusFilter: StaffRentFilter;
  onStatusFilterChange: (filter: StaffRentFilter) => void;
  onSetStatus: (
    rentPeriodId: string,
    confirmedStatus: RentConfirmedStatus,
    confirmedAmount?: number
  ) => void;
}

const FILTER_IDLE =
  "h-auto rounded-[6px] bg-transparent px-4 py-1.5 text-sm font-bold text-grey hover:bg-transparent hover:text-darkGrey";
const FILTER_ACTIVE =
  "h-auto rounded-[6px] bg-white px-4 py-1.5 text-sm font-bold text-darkGrey shadow-sm hover:bg-white hover:text-darkGrey";

const EMPTY_MESSAGE: Record<StaffRentFilter, string> = {
  all: "No rent has been charged for this month yet.",
  reported: "No tenant has reported a payment this month.",
  late: "Nothing is late this month.",
};

function isAwaitingConfirmation(period: StaffRentItem): boolean {
  return period.tenantReportedAt !== null && period.confirmedStatus !== "paid";
}

const StaffRentPage: React.FC<StaffRentPageProps> = ({
  periodLabel,
  buildings,
  buildingId,
  onBuildingIdChange,
  collected,
  outstanding,
  currency,
  periods,
  serverNow,
  statusFilter,
  onStatusFilterChange,
  onSetStatus,
}) => {
  const [partialPeriodId, setPartialPeriodId] = useState<string | null>(null);
  const partialPeriod =
    periods.find((period) => period._id === partialPeriodId) ?? null;
  const reportedCount = periods.filter(isAwaitingConfirmation).length;

  const visible = periods.filter((period) => {
    if (statusFilter === "late") {
      return getRentDisplayStatus(period, serverNow) === "late";
    }
    if (statusFilter === "reported") {
      return isAwaitingConfirmation(period);
    }
    return true;
  });

  const filters: { value: StaffRentFilter; label: string }[] = [
    { value: "all", label: "All" },
    {
      value: "reported",
      label: reportedCount === 0 ? "Reported" : `Reported (${reportedCount})`,
    },
    { value: "late", label: "Late" },
  ];

  return (
    <Box className="max-w-[1200px]">
      <Heading
        variant="page"
        className="mb-2 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
      >
        Rent · {formatPeriodLabel(periodLabel)}
      </Heading>
      <Text className="mb-8 text-base text-grey">
        Every unit with a current lease is charged once a month. This page shows
        what is charged for this month only.
      </Text>
      <Box className="mb-12">
        <StaffRentSummary
          collected={collected}
          outstanding={outstanding}
          currency={currency}
        />
      </Box>
      <Group
        justify="space-between"
        align="center"
        gap="md"
        wrap="wrap"
        className="mb-6"
      >
        <Box className="flex gap-2 rounded-[8px] border border-border bg-sidebar p-1">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant="subtle"
              className={
                statusFilter === filter.value ? FILTER_ACTIVE : FILTER_IDLE
              }
              onClick={() => onStatusFilterChange(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </Box>
        {buildings.length > 1 ? (
          <Select
            aria-label="Building"
            value={buildingId}
            data={buildings.map((building) => ({
              value: building._id,
              label: building.name,
            }))}
            allowDeselect={false}
            pointer
            comboboxProps={{ shadow: "sm" }}
            onChange={(value) => {
              if (value !== null) {
                onBuildingIdChange(value);
              }
            }}
            classNames={{
              input:
                "min-h-10 min-w-[12rem] rounded-[8px] border-border bg-white text-sm font-semibold text-darkGrey",
              dropdown: "rounded-[8px] border border-border bg-white",
              option:
                "rounded-[6px] text-[15px] text-darkGrey bg-white hover:bg-sidebar data-[combobox-selected]:bg-sidebar data-[combobox-active]:bg-sidebar",
            }}
          />
        ) : null}
      </Group>
      {visible.length === 0 ? (
        <Text className="text-base text-grey">
          {EMPTY_MESSAGE[statusFilter]}
        </Text>
      ) : (
        <StaffRentTable
          periods={visible}
          serverNow={serverNow}
          onSetStatus={onSetStatus}
          onRequestPartial={setPartialPeriodId}
        />
      )}
      {partialPeriod !== null ? (
        <ConfirmPartialRentModal
          opened
          unitLabel={partialPeriod.unitLabel}
          tenantName={partialPeriod.tenantName}
          amount={partialPeriod.amount}
          currency={partialPeriod.currency}
          initialConfirmedAmount={partialPeriod.confirmedAmount}
          onConfirm={(confirmedAmount) => {
            onSetStatus(partialPeriod._id, "partial", confirmedAmount);
            setPartialPeriodId(null);
          }}
          onClose={() => setPartialPeriodId(null)}
        />
      ) : null}
    </Box>
  );
};

export default StaffRentPage;
