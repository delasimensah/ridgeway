"use client";

import { Anchor, Box, Table } from "@mantine/core";
import Link from "next/link";
import React from "react";

interface BuildingListRowProps {
  buildingId: string;
  name: string;
  address: string;
  ownerLabel: string;
  unitCount: number;
  openRepairCount: number;
}

const TD = "px-4 py-4 text-[15px] text-darkGrey sm:px-6 sm:py-5";
const NAME_TD = "px-4 py-4 font-bold text-darkGrey sm:px-6 sm:py-5";
const REPAIR_BADGE =
  "rounded border border-border bg-sidebar px-2 py-1 text-[13px] font-bold text-darkGrey";

const BuildingListRow: React.FC<BuildingListRowProps> = ({
  buildingId,
  name,
  address,
  ownerLabel,
  unitCount,
  openRepairCount,
}) => {
  return (
    <Table.Tr className="hover:bg-sidebar">
      <Table.Td className={NAME_TD}>
        <Anchor
          component={Link}
          href={`/buildings/${buildingId}/edit`}
          underline="never"
          className="font-bold text-darkGrey"
        >
          {name}
        </Anchor>
      </Table.Td>
      <Table.Td className={TD}>{address}</Table.Td>
      <Table.Td className={TD}>{ownerLabel}</Table.Td>
      <Table.Td className={TD}>{unitCount}</Table.Td>
      <Table.Td className={TD}>
        <Box component="span" className={REPAIR_BADGE}>
          {openRepairCount}
        </Box>
      </Table.Td>
    </Table.Tr>
  );
};

export default BuildingListRow;
