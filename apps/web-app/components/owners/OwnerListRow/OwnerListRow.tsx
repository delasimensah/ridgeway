"use client";

import { Anchor, Table } from "@mantine/core";
import Link from "next/link";
import React from "react";

interface OwnerListRowProps {
  ownerId: string;
  displayName: string;
  contactEmail: string | null;
  hasLogin: boolean;
  buildingCount: number;
}

const TD = "px-4 py-4 text-[15px] text-darkGrey sm:px-6 sm:py-5";
const NAME_TD = "px-4 py-4 font-bold text-darkGrey sm:px-6 sm:py-5";

const OwnerListRow: React.FC<OwnerListRowProps> = ({
  ownerId,
  displayName,
  contactEmail,
  hasLogin,
  buildingCount,
}) => {
  return (
    <Table.Tr className="hover:bg-sidebar">
      <Table.Td className={NAME_TD}>
        <Anchor
          component={Link}
          href={`/owners/${ownerId}`}
          underline="never"
          className="font-bold text-darkGrey"
        >
          {displayName}
        </Anchor>
      </Table.Td>
      <Table.Td className={TD}>{contactEmail ?? "—"}</Table.Td>
      <Table.Td className={TD}>
        {buildingCount === 0 ? (
          "None"
        ) : (
          <Anchor
            component={Link}
            href={`/owners/${ownerId}`}
            underline="never"
            className="text-[15px] text-darkGrey"
          >
            {buildingCount}
          </Anchor>
        )}
      </Table.Td>
      <Table.Td className={TD}>{hasLogin ? "Yes" : "No"}</Table.Td>
    </Table.Tr>
  );
};

export default OwnerListRow;
