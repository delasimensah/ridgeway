"use client";

import { Box, Button, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";
import type { WorkOrderStatus } from "shared";

import BuildingDetailHeader from "../../buildings/BuildingDetailHeader/BuildingDetailHeader";
import OpenRepairCard from "../../repairs/OpenRepairCard/OpenRepairCard";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";
import UnitListEmpty from "../../units/UnitListEmpty/UnitListEmpty";
import UnitListTable, {
  type UnitListItem,
} from "../../units/UnitListTable/UnitListTable";

export interface BuildingOpenRepair {
  _id: string;
  title: string;
  status: WorkOrderStatus;
  unitLabel: string;
}

interface BuildingDetailPageProps {
  buildingId: string;
  name: string;
  address: string;
  ownerId?: string | null;
  ownerName?: string | null;
  units: UnitListItem[];
  openRepairs?: BuildingOpenRepair[];
}

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-primaryHover";

const SECONDARY_BUTTON =
  "h-auto rounded-[8px] border border-border bg-white px-6 py-2.5 text-[15px] font-semibold text-darkGrey hover:bg-sidebar";

const BuildingDetailPage: React.FC<BuildingDetailPageProps> = ({
  buildingId,
  name,
  address,
  ownerId = null,
  ownerName = null,
  units,
  openRepairs = [],
}) => {
  const isEmpty = units.length === 0;
  const hasVacantUnit = units.some((unit) => unit.leaseId == null);

  return (
    <Box className="max-w-[1200px]">
      <BuildingDetailHeader
        buildingId={buildingId}
        name={name}
        address={address}
        ownerId={ownerId}
        ownerName={ownerName}
      />
      <Box component="section">
        <Group
          justify="space-between"
          align="center"
          gap="md"
          wrap="wrap"
          className="mb-6"
        >
          <Heading
            variant="section"
            className="mb-0 text-[20px] font-bold text-darkGrey"
          >
            Units
          </Heading>
          <Group gap="sm" className="w-full sm:w-auto">
            <Button
              component={Link}
              href={`/buildings/${buildingId}/units/new`}
              className={`${SECONDARY_BUTTON} w-full sm:w-auto`}
            >
              Add unit
            </Button>
            {hasVacantUnit ? (
              <Button
                component={Link}
                href={`/buildings/${buildingId}/tenants/new`}
                className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
              >
                Add tenant
              </Button>
            ) : null}
          </Group>
        </Group>
        {isEmpty ? (
          <UnitListEmpty buildingId={buildingId} />
        ) : (
          <UnitListTable buildingId={buildingId} units={units} />
        )}
      </Box>
      <Box component="section" className="mt-12">
        <Heading
          variant="section"
          className="mb-6 text-[20px] font-bold text-darkGrey"
        >
          Open repairs
        </Heading>
        {openRepairs.length === 0 ? (
          <Text className="text-base text-grey">No open repairs.</Text>
        ) : (
          <Box className="space-y-4">
            {openRepairs.map((repair) => (
              <OpenRepairCard
                key={repair._id}
                href={`/repairs/${repair._id}`}
                title={repair.title}
                subtitle={repair.unitLabel}
                status={repair.status}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BuildingDetailPage;
