"use client";

import { Anchor, Box, Table } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { cn } from "shared";

import BuildingMark from "../../ui/BuildingMark/BuildingMark";

interface BuildingListRowProps {
  buildingId: string;
  name: string;
  address: string;
  ownerLabel: string;
  unitCount: number;
  openRepairCount: number;
}

const TD = "px-4 py-5 text-[15px] text-darkGrey sm:px-6";
const NAME_TD = "px-4 py-5 text-darkGrey sm:px-6";

const BuildingListRow: React.FC<BuildingListRowProps> = ({
  buildingId,
  name,
  address,
  ownerLabel,
  unitCount,
  openRepairCount,
}) => {
  return (
    <Table.Tr className="transition-colors duration-150 hover:bg-sidebar">
      <Table.Td className={NAME_TD}>
        <Anchor
          component={Link}
          href={`/buildings/${buildingId}`}
          underline="never"
          className="flex items-center gap-3 font-semibold text-darkGrey"
        >
          <BuildingMark name={name} />
          {name}
        </Anchor>
      </Table.Td>
      <Table.Td className={TD}>{address}</Table.Td>
      <Table.Td className={TD}>{ownerLabel}</Table.Td>
      <Table.Td className={TD}>{unitCount}</Table.Td>
      <Table.Td className={TD}>
        <Box
          component="span"
          className={cn(
            "text-[15px] font-semibold tabular-nums",
            openRepairCount > 0 ? "text-overdue" : "text-grey"
          )}
        >
          {openRepairCount}
        </Box>
      </Table.Td>
    </Table.Tr>
  );
};

export default BuildingListRow;
