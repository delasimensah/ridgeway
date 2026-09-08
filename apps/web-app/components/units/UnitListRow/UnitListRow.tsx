"use client";

import { Anchor, Table } from "@mantine/core";
import Link from "next/link";
import React from "react";

interface UnitListRowProps {
  buildingId: string;
  unitId: string;
  label: string;
}

const TD = "px-4 py-4 text-[15px] text-darkGrey sm:px-6 sm:py-5";
const LABEL_TD = "px-4 py-4 font-bold text-darkGrey sm:px-6 sm:py-5";

const UnitListRow: React.FC<UnitListRowProps> = ({
  buildingId,
  unitId,
  label,
}) => {
  return (
    <Table.Tr className="hover:bg-sidebar">
      <Table.Td className={LABEL_TD}>
        <Anchor
          component={Link}
          href={`/buildings/${buildingId}/units/${unitId}/edit`}
          underline="never"
          className="font-bold text-darkGrey"
        >
          {label}
        </Anchor>
      </Table.Td>
      <Table.Td className={TD}>—</Table.Td>
      <Table.Td className={TD}>—</Table.Td>
      <Table.Td className={TD}>—</Table.Td>
    </Table.Tr>
  );
};

export default UnitListRow;
