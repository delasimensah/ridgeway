"use client";

import { Box, Group } from "@mantine/core";
import React from "react";
import type { WorkOrderStatus } from "shared";

import RepairStatusBadge from "../../repairs/RepairStatusBadge/RepairStatusBadge";
import Text from "../../ui/Text/Text";

interface OwnerSnapshotIssueRowProps {
  title: string;
  tenantName: string | null;
  unitKind: "apartment" | "commercial";
  status: WorkOrderStatus;
}

function tenantLine(
  tenantName: string | null,
  unitKind: "apartment" | "commercial"
): string {
  if (tenantName !== null) {
    return `Tenant: ${tenantName}`;
  }
  if (unitKind === "commercial") {
    return "Commercial Unit";
  }
  return "";
}

const OwnerSnapshotIssueRow: React.FC<OwnerSnapshotIssueRowProps> = ({
  title,
  tenantName,
  unitKind,
  status,
}) => {
  const subtitle = tenantLine(tenantName, unitKind);

  return (
    <Group
      justify="space-between"
      align="center"
      wrap="nowrap"
      gap="md"
      className="rounded-[8px] border border-border bg-white p-4 shadow-sm"
    >
      <Box className="min-w-0">
        <Text className="font-bold text-darkGrey">{title}</Text>
        {subtitle !== "" ? (
          <Text className="text-sm text-grey">{subtitle}</Text>
        ) : null}
      </Box>
      <RepairStatusBadge status={status} />
    </Group>
  );
};

export default OwnerSnapshotIssueRow;
