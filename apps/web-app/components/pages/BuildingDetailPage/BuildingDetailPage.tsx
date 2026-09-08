"use client";

import { Box, Button, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

import BuildingDetailHeader from "../../buildings/BuildingDetailHeader/BuildingDetailHeader";
import Heading from "../../ui/Heading/Heading";
import UnitListEmpty from "../../units/UnitListEmpty/UnitListEmpty";
import UnitListTable, {
  type UnitListItem,
} from "../../units/UnitListTable/UnitListTable";

interface BuildingDetailPageProps {
  buildingId: string;
  name: string;
  address: string;
  ownerId?: string | null;
  ownerName?: string | null;
  units: UnitListItem[];
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
}) => {
  const isEmpty = units.length === 0;

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
            {isEmpty ? null : (
              <Button
                component={Link}
                href={`/buildings/${buildingId}/tenants/new`}
                className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
              >
                Add tenant
              </Button>
            )}
          </Group>
        </Group>
        {isEmpty ? (
          <UnitListEmpty buildingId={buildingId} />
        ) : (
          <UnitListTable buildingId={buildingId} units={units} />
        )}
      </Box>
    </Box>
  );
};

export default BuildingDetailPage;
