"use client";

import { Anchor, Table } from "@mantine/core";
import Link from "next/link";
import React from "react";

interface OfficeListRowProps {
  profileId: string;
  displayName: string;
  email: string | null;
  hasLogin: boolean;
}

const TD = "px-4 py-4 text-[15px] text-darkGrey sm:px-6 sm:py-5";
const NAME_TD = "px-4 py-4 font-bold text-darkGrey sm:px-6 sm:py-5";

const OfficeListRow: React.FC<OfficeListRowProps> = ({
  profileId,
  displayName,
  email,
  hasLogin,
}) => {
  return (
    <Table.Tr className="hover:bg-sidebar">
      <Table.Td className={NAME_TD}>
        <Anchor
          component={Link}
          href={`/office/${profileId}/edit`}
          underline="never"
          className="font-bold text-darkGrey"
        >
          {displayName}
        </Anchor>
      </Table.Td>
      <Table.Td className={TD}>{email ?? "—"}</Table.Td>
      <Table.Td className={TD}>{hasLogin ? "Yes" : "No"}</Table.Td>
    </Table.Tr>
  );
};

export default OfficeListRow;
