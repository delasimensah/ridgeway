"use client";

import { Anchor, Box, Table } from "@mantine/core";
import Link from "next/link";
import React from "react";

import PersonAvatar from "../../ui/PersonAvatar/PersonAvatar";

interface TenantListRowProps {
  leaseId: string;
  displayName: string;
  email: string;
  hasLogin: boolean;
  currentBuildingName: string | null;
  currentUnitLabel: string | null;
}

const TD = "px-4 py-4 text-[15px] text-darkGrey sm:px-6 sm:py-5";
const NAME_TD = "px-4 py-4 font-bold text-darkGrey sm:px-6 sm:py-5";

function currentPlace(
  currentBuildingName: string | null,
  currentUnitLabel: string | null
): string {
  if (currentBuildingName === null || currentUnitLabel === null) {
    return "None";
  }
  return `${currentBuildingName} · ${currentUnitLabel}`;
}

const TenantListRow: React.FC<TenantListRowProps> = ({
  leaseId,
  displayName,
  email,
  hasLogin,
  currentBuildingName,
  currentUnitLabel,
}) => {
  return (
    <Table.Tr className="hover:bg-sidebar">
      <Table.Td className={NAME_TD}>
        <Anchor
          component={Link}
          href={`/tenants/${leaseId}/edit`}
          underline="never"
          className="inline-flex items-center gap-3 font-bold text-darkGrey"
        >
          <PersonAvatar displayName={displayName} decorative />
          <Box component="span">{displayName}</Box>
        </Anchor>
      </Table.Td>
      <Table.Td className={TD}>{email}</Table.Td>
      <Table.Td className={TD}>
        {currentPlace(currentBuildingName, currentUnitLabel)}
      </Table.Td>
      <Table.Td className={TD}>{hasLogin ? "Yes" : "No"}</Table.Td>
    </Table.Tr>
  );
};

export default TenantListRow;
