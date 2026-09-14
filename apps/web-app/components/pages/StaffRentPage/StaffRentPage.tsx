"use client";

import { Box, Button, Group, Select } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React, { useState } from "react";
import {
  type Currency,
  formatMonthName,
  getRentDisplayStatus,
  periodLabelForYear,
  type RentConfirmedStatus,
  shiftPeriodLabel,
  yearsInPeriodRange,
} from "shared";

import ConfirmPartialRentModal from "../../rent/ConfirmPartialRentModal/ConfirmPartialRentModal";
import StaffRentSummary from "../../rent/StaffRentSummary/StaffRentSummary";
import StaffRentSummarySkeleton from "../../rent/StaffRentSummary/StaffRentSummarySkeleton";
import StaffRentTable, {
  type StaffRentItem,
} from "../../rent/StaffRentTable/StaffRentTable";
import StaffRentTableSkeleton from "../../rent/StaffRentTable/StaffRentTableSkeleton";
import Heading from "../../ui/Heading/Heading";
import Skeleton from "../../ui/Skeleton/Skeleton";
import Text from "../../ui/Text/Text";

export type StaffRentFilter = "all" | "reported" | "late";

export interface StaffRentBuildingOption {
  _id: string;
  name: string;
}

interface StaffRentPageProps {
  isLoading?: boolean;
  periodLabel: string;
  earliestPeriodLabel: string | null;
  onPeriodLabelChange: (periodLabel: string) => void;
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
  isLoading = false,
  periodLabel,
  earliestPeriodLabel,
  onPeriodLabelChange,
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
  const currentMonth =
    serverNow > 0 ? new Date(serverNow).toISOString().slice(0, 7) : periodLabel;
  const canGoEarlier =
    !isLoading &&
    earliestPeriodLabel !== null &&
    periodLabel !== "" &&
    periodLabel > earliestPeriodLabel;
  const canGoLater =
    !isLoading && periodLabel !== "" && periodLabel < currentMonth;
  const rangeStart = earliestPeriodLabel ?? periodLabel;
  const rangeEnd = currentMonth !== "" ? currentMonth : periodLabel;
  const yearOptions =
    periodLabel === "" || rangeStart === "" || rangeEnd === ""
      ? []
      : yearsInPeriodRange(rangeStart, rangeEnd);
  const selectedYear = periodLabel.slice(0, 4);
  const canPickYear = !isLoading && yearOptions.length > 1;

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
      <Group
        justify="space-between"
        align="center"
        gap="md"
        wrap="wrap"
        className="mb-2"
      >
        <Heading
          variant="page"
          className="text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
        >
          Rent
        </Heading>
        <Group
          gap={6}
          wrap="nowrap"
          align="center"
          aria-label="Month"
          className="shrink-0 rounded-[10px] border border-border bg-sidebar p-1"
        >
          <Button
            variant="default"
            aria-label="Previous month"
            disabled={!canGoEarlier}
            onClick={() =>
              onPeriodLabelChange(shiftPeriodLabel(periodLabel, -1))
            }
            className="h-9 w-9 shrink-0 rounded-[8px] border-border bg-white p-0 text-darkGrey disabled:opacity-40"
          >
            <IconChevronLeft size={18} stroke={2} />
          </Button>
          <Box className="flex h-9 w-[7.25rem] shrink-0 items-center justify-center">
            {periodLabel === "" ? (
              <Skeleton height={18} width={96} />
            ) : (
              <Text
                aria-live="polite"
                className="text-center text-[15px] font-bold text-darkGrey"
              >
                {formatMonthName(periodLabel)}
              </Text>
            )}
          </Box>
          {periodLabel === "" ? (
            <Skeleton height={36} width={72} radius={8} />
          ) : (
            <Select
              aria-label="Year"
              value={selectedYear}
              data={yearOptions.map((year) => ({
                value: year,
                label: year,
              }))}
              disabled={!canPickYear}
              allowDeselect={false}
              pointer={canPickYear}
              comboboxProps={{ shadow: "sm", width: "target" }}
              onChange={(value) => {
                if (value === null || rangeStart === "" || rangeEnd === "") {
                  return;
                }
                onPeriodLabelChange(
                  periodLabelForYear(
                    periodLabel,
                    Number(value),
                    rangeStart,
                    rangeEnd
                  )
                );
              }}
              classNames={{
                root: "w-[4.75rem] shrink-0",
                input:
                  "h-9 min-h-9 rounded-[8px] border-border bg-white px-2 text-center text-[15px] font-bold text-darkGrey disabled:bg-white disabled:opacity-100",
                dropdown: "rounded-[8px] border border-border bg-white",
                option:
                  "rounded-[6px] text-[15px] font-semibold text-darkGrey bg-white hover:bg-sidebar data-[combobox-selected]:bg-sidebar data-[combobox-active]:bg-sidebar",
              }}
            />
          )}
          <Button
            variant="default"
            aria-label="Next month"
            disabled={!canGoLater}
            onClick={() =>
              onPeriodLabelChange(shiftPeriodLabel(periodLabel, 1))
            }
            className="h-9 w-9 shrink-0 rounded-[8px] border-border bg-white p-0 text-darkGrey disabled:opacity-40"
          >
            <IconChevronRight size={18} stroke={2} />
          </Button>
        </Group>
      </Group>
      <Text className="mb-8 text-base text-grey">
        Every unit with a current lease is charged once a month. Step back to
        earlier months, and see arrears carried forward on each row.
      </Text>
      <Box className="mb-12">
        {isLoading ? (
          <StaffRentSummarySkeleton />
        ) : (
          <StaffRentSummary
            collected={collected}
            outstanding={outstanding}
            currency={currency}
          />
        )}
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
              disabled={isLoading}
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
      {isLoading ? (
        <StaffRentTableSkeleton />
      ) : visible.length === 0 ? (
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
