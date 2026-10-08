"use client";

import { Anchor, Box, Table } from "@mantine/core";
import Link from "next/link";
import React from "react";

import PersonAvatar from "../../ui/PersonAvatar/PersonAvatar";

interface FieldListRowProps {
  profileId: string;
  displayName: string;
  email: string | null;
  hasLogin: boolean;
}

const TD = "px-4 py-4 text-[15px] text-darkGrey sm:px-6 sm:py-5";
const NAME_TD = "px-4 py-4 font-bold text-darkGrey sm:px-6 sm:py-5";

const FieldListRow: React.FC<FieldListRowProps> = ({
  profileId,
  displayName,
  email,
  hasLogin,
}) => {
  const href = `/field/${profileId}`;

  return (
    <Table.Tr className="relative cursor-pointer hover:bg-sidebar">
      <Table.Td className={NAME_TD}>
        <Anchor
          component={Link}
          href={href}
          underline="never"
          className="inline-flex items-center gap-3 font-bold text-darkGrey after:absolute after:inset-0"
        >
          <PersonAvatar displayName={displayName} decorative />
          <Box component="span">{displayName}</Box>
        </Anchor>
      </Table.Td>
      <Table.Td className={TD}>{email ?? "—"}</Table.Td>
      <Table.Td className={TD}>{hasLogin ? "Yes" : "No"}</Table.Td>
    </Table.Tr>
  );
};

export default FieldListRow;
