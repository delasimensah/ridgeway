"use client";

import { Box, Group } from "@mantine/core";
import React from "react";
import { getRelativeTime, type WorkOrderStatus } from "shared";

import { areaFromAccraAddress } from "@/utils";

import RepairStatusBadge from "../../repairs/RepairStatusBadge/RepairStatusBadge";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface OwnerPortfolioIssueRowProps {
  title: string;
  status: WorkOrderStatus;
  buildingName: string;
  address: string;
  tenantName: string | null;
  unitKind: "apartment" | "commercial";
  reportedAt: number;
}

function whoLine(
  tenantName: string | null,
  unitKind: "apartment" | "commercial"
): string | null {
  if (tenantName !== null) {
    return tenantName;
  }
  if (unitKind === "commercial") {
    return "Commercial";
  }
  return null;
}

const OwnerPortfolioIssueRow: React.FC<OwnerPortfolioIssueRowProps> = ({
  title,
  status,
  buildingName,
  address,
  tenantName,
  unitKind,
  reportedAt,
}) => {
  const subtitle = [
    buildingName,
    areaFromAccraAddress(address),
    whoLine(tenantName, unitKind),
  ]
    .filter((part) => part !== null && part !== "")
    .join(" · ");

  return (
    <Group
      justify="space-between"
      align="center"
      wrap="wrap"
      gap="md"
      className="p-6"
    >
      <Box className="min-w-0">
        <Group gap="sm" align="center" mb={4} wrap="wrap">
          <Heading
            variant="card"
            className="mb-0 text-[18px] font-bold text-darkGrey"
          >
            {title}
          </Heading>
          <RepairStatusBadge status={status} />
        </Group>
        <Text className="text-sm text-grey">{subtitle}</Text>
      </Box>
      <Box className="text-left sm:text-right">
        <Text className="text-[12px] font-medium text-grey">Reported</Text>
        <Text className="text-sm font-semibold text-darkGrey">
          {getRelativeTime(new Date(reportedAt))}
        </Text>
      </Box>
    </Group>
  );
};

export default OwnerPortfolioIssueRow;
