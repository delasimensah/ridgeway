"use client";

import { Anchor, Box } from "@mantine/core";
import Link from "next/link";
import React from "react";
import type { WorkOrderStatus } from "shared";

import Text from "../../ui/Text/Text";
import RepairStatusBadge from "../RepairStatusBadge/RepairStatusBadge";

interface OpenRepairCardProps {
  href: string;
  title: string;
  subtitle: string;
  status: WorkOrderStatus;
}

const OpenRepairCard: React.FC<OpenRepairCardProps> = ({
  href,
  title,
  subtitle,
  status,
}) => {
  return (
    <Anchor
      component={Link}
      href={href}
      underline="never"
      className="!flex items-center justify-between gap-4 rounded-[8px] border border-border bg-white p-4 shadow-card"
    >
      <Box>
        <Text className="font-bold text-darkGrey">{title}</Text>
        <Text className="text-sm text-grey">{subtitle}</Text>
      </Box>
      <RepairStatusBadge status={status} />
    </Anchor>
  );
};

export default OpenRepairCard;
