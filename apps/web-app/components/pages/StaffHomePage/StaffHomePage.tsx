"use client";

import { Anchor, Box, SimpleGrid, Stack } from "@mantine/core";
import {
  IconBuilding,
  IconCashBanknote,
  IconDoor,
  IconTool,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import {
  type Currency,
  getRentDisplayStatus,
  type RentConfirmedStatus,
  type ScreenLoadState,
  type WorkOrderStatus,
} from "shared";

import BuildingListEmpty from "../../buildings/BuildingListEmpty/BuildingListEmpty";
import StaffHomeMetricCard from "../../home/StaffHomeMetricCard/StaffHomeMetricCard";
import StaffHomeMetricCardSkeleton from "../../home/StaffHomeMetricCard/StaffHomeMetricCardSkeleton";
import StaffRentSummary from "../../rent/StaffRentSummary/StaffRentSummary";
import StaffRentSummarySkeleton from "../../rent/StaffRentSummary/StaffRentSummarySkeleton";
import OpenRepairCard from "../../repairs/OpenRepairCard/OpenRepairCard";
import OpenRepairCardSkeleton from "../../repairs/OpenRepairCard/OpenRepairCardSkeleton";
import LoadFailed from "../../shared/LoadFailed/LoadFailed";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffHomeRepair {
  _id: string;
  title: string;
  status: WorkOrderStatus;
  unitLabel: string;
  buildingName: string;
}

interface StaffHomeRentPeriod {
  _id: string;
  confirmedStatus: RentConfirmedStatus;
  dueOn: string;
  unitLabel: string;
  tenantName: string;
  buildingName: string;
}

const OPEN_REPAIR_LIMIT = 5;
const LATE_RENT_LIMIT = 5;

interface StaffHomePageProps {
  greeting: string;
  loadState?: ScreenLoadState;
  onRetry?: () => void;
  buildingCount: number;
  emptyUnitCount: number;
  repairs: StaffHomeRepair[];
  collected: number;
  outstanding: number;
  currency: Currency;
  rentPeriods: StaffHomeRentPeriod[];
  serverNow: number;
}

function openRepairsHeading(repairs: StaffHomeRepair[]): string {
  const names = [
    ...new Set(
      repairs.map((repair) => repair.buildingName).filter((name) => name !== "")
    ),
  ];
  if (names.length === 1 && names[0] !== undefined) {
    return `Today at ${names[0]}`;
  }
  return "Open repairs";
}

const StaffHomePage: React.FC<StaffHomePageProps> = ({
  greeting,
  loadState = "ready",
  onRetry,
  buildingCount,
  emptyUnitCount,
  repairs,
  collected,
  outstanding,
  currency,
  rentPeriods,
  serverNow,
}) => {
  const latePeriods = rentPeriods.filter(
    (period) => getRentDisplayStatus(period, serverNow) === "late"
  );
  const lateCount = latePeriods.length;
  const visibleRepairs = repairs.slice(0, OPEN_REPAIR_LIMIT);
  const visibleLate = latePeriods.slice(0, LATE_RENT_LIMIT);
  const showPortfolio =
    loadState === "loading" || (loadState === "ready" && buildingCount > 0);

  return (
    <Stack gap={0} className="max-w-[1200px]">
      <Heading
        variant="page"
        className="mb-8 text-[24px] font-bold text-darkGrey sm:text-[28px] md:mb-12 md:text-[32px]"
      >
        {greeting}
      </Heading>
      {loadState === "failed" ? (
        <LoadFailed title="Couldn't load home." onRetry={onRetry} />
      ) : null}
      {loadState === "loading" ? (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing="lg"
          className="mb-8 md:mb-12"
          aria-busy="true"
          aria-label="Loading home"
        >
          <StaffHomeMetricCardSkeleton />
          <StaffHomeMetricCardSkeleton />
          <StaffHomeMetricCardSkeleton />
          <StaffHomeMetricCardSkeleton />
        </SimpleGrid>
      ) : null}
      {loadState === "ready" && buildingCount === 0 ? (
        <BuildingListEmpty />
      ) : null}
      {loadState === "ready" && buildingCount > 0 ? (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing="lg"
          className="mb-8 md:mb-12"
        >
          <StaffHomeMetricCard
            label="Buildings"
            value={buildingCount}
            href="/buildings"
            Icon={IconBuilding}
          />
          <StaffHomeMetricCard
            label="Open repairs"
            value={repairs.length}
            href="/repairs"
            Icon={IconTool}
          />
          <StaffHomeMetricCard
            label="Rent late"
            value={lateCount}
            href="/rent"
            Icon={IconCashBanknote}
            valueClassName="text-overdue"
          />
          <StaffHomeMetricCard
            label="Units empty"
            value={emptyUnitCount}
            href="/buildings"
            Icon={IconDoor}
          />
        </SimpleGrid>
      ) : null}
      {showPortfolio ? (
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={{ base: 32, lg: 48 }}>
          <Box component="section">
            <Heading
              variant="section"
              className="mb-6 text-[20px] font-bold text-darkGrey"
            >
              {loadState === "loading"
                ? "Open repairs"
                : openRepairsHeading(repairs)}
            </Heading>
            {loadState === "loading" ? (
              <Box
                className="space-y-4"
                aria-busy="true"
                aria-label="Loading repairs"
              >
                <OpenRepairCardSkeleton />
                <OpenRepairCardSkeleton />
                <OpenRepairCardSkeleton />
              </Box>
            ) : null}
            {loadState === "ready" && repairs.length === 0 ? (
              <Box className="flex items-center gap-3 rounded-[8px] border border-dashed border-border bg-white px-4 py-5">
                <IconTool
                  size={20}
                  stroke={1.5}
                  className="text-grey"
                  aria-hidden
                />
                <Text className="text-base text-grey">
                  Nothing open right now.
                </Text>
              </Box>
            ) : null}
            {loadState === "ready" && repairs.length > 0 ? (
              <Box className="space-y-4">
                {visibleRepairs.map((repair) => (
                  <OpenRepairCard
                    key={repair._id}
                    href={`/repairs/${repair._id}`}
                    title={repair.title}
                    subtitle={`${repair.buildingName} · ${repair.unitLabel}`}
                    status={repair.status}
                  />
                ))}
                {repairs.length > OPEN_REPAIR_LIMIT ? (
                  <Anchor
                    component={Link}
                    href="/repairs"
                    underline="never"
                    className="inline-block text-sm font-semibold text-darkGrey"
                  >
                    View all repairs
                  </Anchor>
                ) : null}
              </Box>
            ) : null}
          </Box>
          <Box component="section">
            <Heading
              variant="section"
              className="mb-6 text-[20px] font-bold text-darkGrey"
            >
              Rent status
            </Heading>
            {loadState === "loading" ? (
              <StaffRentSummarySkeleton layout="stack" />
            ) : (
              <Box>
                <Anchor
                  component={Link}
                  href="/rent"
                  underline="never"
                  aria-label="Rent status"
                  className="!block"
                >
                  <StaffRentSummary
                    layout="stack"
                    collected={collected}
                    outstanding={outstanding}
                    currency={currency}
                  />
                </Anchor>
                {visibleLate.length > 0 ? (
                  <Box className="mt-4 rounded-[8px] border border-border bg-white p-4 shadow-card">
                    <Text className="mb-3 text-sm font-semibold text-darkGrey">
                      Late this month
                    </Text>
                    <Box className="space-y-3">
                      {visibleLate.map((period) => (
                        <Anchor
                          key={period._id}
                          component={Link}
                          href="/rent"
                          underline="never"
                          className="!block"
                        >
                          <Text className="text-sm font-semibold text-darkGrey">
                            {period.unitLabel}
                            {period.tenantName !== ""
                              ? ` · ${period.tenantName}`
                              : ""}
                          </Text>
                          <Text className="text-[13px] text-grey">
                            {period.buildingName}
                          </Text>
                        </Anchor>
                      ))}
                    </Box>
                    {lateCount > LATE_RENT_LIMIT ? (
                      <Anchor
                        component={Link}
                        href="/rent"
                        underline="never"
                        className="mt-3 inline-block text-sm font-semibold text-darkGrey"
                      >
                        View all late rent
                      </Anchor>
                    ) : null}
                  </Box>
                ) : null}
              </Box>
            )}
          </Box>
        </SimpleGrid>
      ) : null}
    </Stack>
  );
};

export default StaffHomePage;
