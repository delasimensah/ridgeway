"use client";

import { Box, Button, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";
import type {
  Currency,
  RentConfirmedStatus,
  ScreenLoadState,
  WorkOrderStatus,
} from "shared";

import { formatRepairDate } from "@/utils";

import NextRentCard from "../../rent/NextRentCard/NextRentCard";
import NextRentCardSkeleton from "../../rent/NextRentCard/NextRentCardSkeleton";
import OpenRepairCard from "../../repairs/OpenRepairCard/OpenRepairCard";
import OpenRepairCardSkeleton from "../../repairs/OpenRepairCard/OpenRepairCardSkeleton";
import LoadFailed from "../../shared/LoadFailed/LoadFailed";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface TenantHomeRepair {
  _id: string;
  title: string;
  status: WorkOrderStatus;
  reportedAt: number;
}

export interface TenantHomeNextRent {
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
}

interface TenantHomePageProps {
  unitLabel: string;
  buildingName: string;
  address: string;
  repairs: TenantHomeRepair[];
  nextRent?: TenantHomeNextRent | null;
  serverNow?: number;
  loadState?: ScreenLoadState;
  onRetry?: () => void;
}

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-6 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover";
const SECONDARY_BUTTON =
  "h-auto rounded-[8px] border border-border bg-white px-6 py-3 text-[15px] font-semibold text-darkGrey hover:border-primaryHover hover:bg-primaryHover hover:text-white";

const TenantHomePage: React.FC<TenantHomePageProps> = ({
  unitLabel,
  buildingName,
  address,
  repairs,
  nextRent = null,
  serverNow = 0,
  loadState = "ready",
  onRetry,
}) => {
  return (
    <Box className="mx-auto w-full max-w-[800px] px-4 py-8 sm:px-6 sm:py-12">
      <Heading
        variant="page"
        className="mb-2 text-[24px] font-bold text-darkGrey sm:text-[32px]"
      >
        Unit {unitLabel} · {buildingName}
      </Heading>
      <Text className="mb-8 text-lg text-grey sm:mb-12">{address}</Text>
      <Group gap="md" className="mb-8">
        <Button component={Link} href="/repairs/new" className={PRIMARY_BUTTON}>
          File a repair
        </Button>
        <Button component={Link} href="/rent" className={SECONDARY_BUTTON}>
          Rent
        </Button>
      </Group>
      {loadState === "failed" ? (
        <LoadFailed title="Couldn't load home." onRetry={onRetry} />
      ) : (
        <Box className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {loadState === "loading" || nextRent !== null ? (
            <Box component="section">
              <Heading
                variant="section"
                className="mb-4 text-[14px] font-bold uppercase tracking-wider text-grey"
              >
                Next rent
              </Heading>
              {loadState === "loading" ? <NextRentCardSkeleton /> : null}
              {loadState === "ready" && nextRent !== null ? (
                <NextRentCard
                  amount={nextRent.amount}
                  currency={nextRent.currency}
                  dueOn={nextRent.dueOn}
                  confirmedStatus={nextRent.confirmedStatus}
                  serverNow={serverNow}
                />
              ) : null}
            </Box>
          ) : null}
          <Box component="section">
            <Heading
              variant="section"
              className="mb-4 text-[14px] font-bold uppercase tracking-wider text-grey"
            >
              Open repairs
            </Heading>
            {loadState === "loading" ? (
              <Box
                className="space-y-4"
                aria-busy="true"
                aria-label="Loading repairs"
              >
                <OpenRepairCardSkeleton />
                <OpenRepairCardSkeleton />
              </Box>
            ) : null}
            {loadState === "ready" && repairs.length === 0 ? (
              <Text className="text-base text-grey">No open repairs.</Text>
            ) : null}
            {loadState === "ready" && repairs.length > 0 ? (
              <Box className="space-y-4">
                {repairs.map((repair) => (
                  <OpenRepairCard
                    key={repair._id}
                    href={`/repairs/${repair._id}`}
                    title={repair.title}
                    subtitle={`Reported ${formatRepairDate(repair.reportedAt)}`}
                    status={repair.status}
                  />
                ))}
              </Box>
            ) : null}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TenantHomePage;
