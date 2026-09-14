"use client";

import { Anchor, Box, SimpleGrid, Stack } from "@mantine/core";
import Link from "next/link";
import React from "react";
import {
  type Currency,
  getRentDisplayStatus,
  type RentConfirmedStatus,
  type WorkOrderStatus,
} from "shared";

import BuildingListEmpty from "../../buildings/BuildingListEmpty/BuildingListEmpty";
import StaffHomeMetricCard from "../../home/StaffHomeMetricCard/StaffHomeMetricCard";
import StaffRentSummary from "../../rent/StaffRentSummary/StaffRentSummary";
import OpenRepairCard from "../../repairs/OpenRepairCard/OpenRepairCard";
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
  confirmedStatus: RentConfirmedStatus;
  dueOn: string;
}

interface StaffHomePageProps {
  greeting: string;
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
  buildingCount,
  emptyUnitCount,
  repairs,
  collected,
  outstanding,
  currency,
  rentPeriods,
  serverNow,
}) => {
  const lateCount = rentPeriods.filter(
    (period) => getRentDisplayStatus(period, serverNow) === "late"
  ).length;

  return (
    <Stack gap={0} className="max-w-[1200px]">
      <Heading
        variant="page"
        className="mb-8 text-[24px] font-bold text-darkGrey sm:text-[28px] md:mb-12 md:text-[32px]"
      >
        {greeting}
      </Heading>
      {buildingCount === 0 ? (
        <BuildingListEmpty />
      ) : (
        <>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 4 }}
            spacing="lg"
            className="mb-8 md:mb-12"
          >
            <StaffHomeMetricCard
              label="Buildings"
              value={buildingCount}
              href="/buildings"
            />
            <StaffHomeMetricCard
              label="Open repairs"
              value={repairs.length}
              href="/repairs"
            />
            <StaffHomeMetricCard
              label="Rent late"
              value={lateCount}
              href="/rent"
              valueClassName="text-overdue"
            />
            <StaffHomeMetricCard
              label="Units empty"
              value={emptyUnitCount}
              href="/buildings"
            />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={{ base: 32, lg: 48 }}>
            <Box component="section">
              <Heading
                variant="section"
                className="mb-6 text-[20px] font-bold text-darkGrey"
              >
                {openRepairsHeading(repairs)}
              </Heading>
              {repairs.length === 0 ? (
                <Text className="text-base text-grey">No open repairs.</Text>
              ) : (
                <Box className="space-y-4">
                  {repairs.map((repair) => (
                    <OpenRepairCard
                      key={repair._id}
                      href={`/repairs/${repair._id}`}
                      title={repair.title}
                      subtitle={`${repair.buildingName} · ${repair.unitLabel}`}
                      status={repair.status}
                    />
                  ))}
                </Box>
              )}
            </Box>
            <Box component="section">
              <Heading
                variant="section"
                className="mb-6 text-[20px] font-bold text-darkGrey"
              >
                Rent status
              </Heading>
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
            </Box>
          </SimpleGrid>
        </>
      )}
    </Stack>
  );
};

export default StaffHomePage;
