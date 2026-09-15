"use client";

import { Anchor, Box, SimpleGrid, Stack } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { type Currency, formatMoney, type WorkOrderStatus } from "shared";

import OwnerSnapshotIssueRow from "../../owner/OwnerSnapshotIssueRow/OwnerSnapshotIssueRow";
import OwnerSnapshotMetricCard from "../../owner/OwnerSnapshotMetricCard/OwnerSnapshotMetricCard";
import OwnerUpcomingRentTable, {
  type OwnerUpcomingRentItem,
} from "../../owner/OwnerUpcomingRentTable/OwnerUpcomingRentTable";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface OwnerBuildingIssue {
  _id: string;
  title: string;
  status: WorkOrderStatus;
  tenantName: string | null;
  unitKind: "apartment" | "commercial";
}

interface OwnerBuildingSnapshotPageProps {
  name: string;
  address: string;
  occupiedCount: number;
  unitCount: number;
  openRepairCount: number;
  collected: number;
  currency: Currency;
  issues: OwnerBuildingIssue[];
  periods: OwnerUpcomingRentItem[];
}

const OwnerBuildingSnapshotPage: React.FC<OwnerBuildingSnapshotPageProps> = ({
  name,
  address,
  occupiedCount,
  unitCount,
  openRepairCount,
  collected,
  currency,
  issues,
  periods,
}) => {
  const unitHint = unitCount === 1 ? "of 1 unit" : `of ${unitCount} units`;

  return (
    <Stack gap={0} className="max-w-[1200px]">
      <Anchor
        component={Link}
        href="/"
        underline="never"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-grey hover:text-darkGrey"
      >
        <IconArrowLeft size={14} aria-hidden />
        Back to Home
      </Anchor>
      <Heading
        variant="page"
        className="mb-1 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
      >
        {name}
      </Heading>
      <Text className="mb-8 text-base text-grey md:mb-12">{address}</Text>
      <SimpleGrid
        cols={{ base: 1, md: 3 }}
        spacing="md"
        className="mb-8 md:mb-12"
      >
        <OwnerSnapshotMetricCard
          label="Occupancy"
          value={String(occupiedCount)}
          hint={unitHint}
        />
        <OwnerSnapshotMetricCard
          label="Open Repairs"
          value={String(openRepairCount)}
        />
        <OwnerSnapshotMetricCard
          label="Monthly Yield"
          value={formatMoney(collected, currency)}
        />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={{ base: 32, lg: 48 }}>
        <Box component="section">
          <Heading
            variant="section"
            className="mb-6 text-[20px] font-bold text-darkGrey"
          >
            Open issues
          </Heading>
          {issues.length === 0 ? (
            <Text className="text-base text-grey">No open issues.</Text>
          ) : (
            <Stack gap="sm">
              {issues.map((issue) => (
                <OwnerSnapshotIssueRow
                  key={issue._id}
                  title={issue.title}
                  tenantName={issue.tenantName}
                  unitKind={issue.unitKind}
                  status={issue.status}
                />
              ))}
            </Stack>
          )}
          <Anchor
            component={Link}
            href="/repairs"
            underline="never"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-darkGrey hover:underline"
          >
            View all issues across portfolio
            <IconArrowRight size={12} aria-hidden />
          </Anchor>
        </Box>
        <Box component="section">
          <Heading
            variant="section"
            className="mb-6 text-[20px] font-bold text-darkGrey"
          >
            Upcoming rents
          </Heading>
          {periods.length === 0 ? (
            <Text className="text-base text-grey">
              No rent has been charged this month.
            </Text>
          ) : (
            <OwnerUpcomingRentTable periods={periods} />
          )}
        </Box>
      </SimpleGrid>
    </Stack>
  );
};

export default OwnerBuildingSnapshotPage;
