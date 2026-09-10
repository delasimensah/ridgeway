"use client";

import type { Id } from "@convex/_generated/dataModel";
import { Anchor, Box, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

import type { AddTenantFormValues } from "@/utils";

import AddTenantForm, {
  type TenantUnitOption,
} from "../../tenants/AddTenantForm/AddTenantForm";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface AddTenantPageProps {
  buildingId: Id<"buildings">;
  buildingName: string;
  units: TenantUnitOption[];
  unitLabel?: string;
  leaseId?: Id<"leases">;
  lockUnit?: boolean;
  initialValues?: AddTenantFormValues;
  hasLogin?: boolean;
}

const AddTenantPage: React.FC<AddTenantPageProps> = ({
  buildingId,
  buildingName,
  units,
  unitLabel,
  leaseId,
  lockUnit,
  initialValues,
  hasLogin,
}) => {
  return (
    <Box className="max-w-[800px]">
      <Box className="mb-8 sm:mb-10">
        <Group gap={8} className="mb-2 text-[14px] font-medium">
          <Anchor
            component={Link}
            href={`/buildings/${buildingId}`}
            underline="never"
            className="text-grey hover:text-darkGrey"
          >
            {buildingName}
          </Anchor>
          {unitLabel ? (
            <Text component="span" className="text-grey">
              /
            </Text>
          ) : null}
          {unitLabel ? (
            <Text component="span" className="text-grey">
              {unitLabel}
            </Text>
          ) : null}
        </Group>
        <Heading
          variant="page"
          className="mb-0 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
        >
          Add tenant
        </Heading>
      </Box>
      <Box className="rounded-[8px] border border-border bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <AddTenantForm
          buildingId={buildingId}
          units={units}
          leaseId={leaseId}
          lockUnit={lockUnit}
          initialValues={initialValues}
          hasLogin={hasLogin}
        />
      </Box>
    </Box>
  );
};

export default AddTenantPage;
