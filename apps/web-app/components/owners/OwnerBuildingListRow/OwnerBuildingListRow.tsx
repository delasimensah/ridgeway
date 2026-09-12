"use client";

import { Anchor, Table } from "@mantine/core";
import Link from "next/link";
import React from "react";

interface OwnerBuildingListRowProps {
  buildingId: string;
  name: string;
  address: string;
}

const TD = "px-4 py-4 text-[15px] text-darkGrey sm:px-6 sm:py-5";
const NAME_TD = "px-4 py-4 font-bold text-darkGrey sm:px-6 sm:py-5";

const OwnerBuildingListRow: React.FC<OwnerBuildingListRowProps> = ({
  buildingId,
  name,
  address,
}) => {
  return (
    <Table.Tr className="hover:bg-sidebar">
      <Table.Td className={NAME_TD}>
        <Anchor
          component={Link}
          href={`/buildings/${buildingId}`}
          underline="never"
          className="font-bold text-darkGrey"
        >
          {name}
        </Anchor>
      </Table.Td>
      <Table.Td className={TD}>{address}</Table.Td>
    </Table.Tr>
  );
};

export default OwnerBuildingListRow;
