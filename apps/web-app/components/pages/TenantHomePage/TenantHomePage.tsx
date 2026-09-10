"use client";

import { Box, Button } from "@mantine/core";
import Link from "next/link";
import React from "react";
import type { WorkOrderStatus } from "shared";

import { formatRepairDate } from "@/utils";

import OpenRepairCard from "../../repairs/OpenRepairCard/OpenRepairCard";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface TenantHomeRepair {
  _id: string;
  title: string;
  status: WorkOrderStatus;
  reportedAt: number;
}

interface TenantHomePageProps {
  unitLabel: string;
  buildingName: string;
  address: string;
  repairs: TenantHomeRepair[];
}

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-6 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover";

const TenantHomePage: React.FC<TenantHomePageProps> = ({
  unitLabel,
  buildingName,
  address,
  repairs,
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
      <Button
        component={Link}
        href="/repairs/new"
        className={`${PRIMARY_BUTTON} mb-8`}
      >
        File a repair
      </Button>
      <Box component="section">
        <Heading
          variant="section"
          className="mb-4 text-[14px] font-bold uppercase tracking-wider text-grey"
        >
          Open repairs
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
                subtitle={`Reported ${formatRepairDate(repair.reportedAt)}`}
                status={repair.status}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TenantHomePage;
