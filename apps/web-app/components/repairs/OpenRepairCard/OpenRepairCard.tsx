"use client";

import { Anchor, Box } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { cn, type WorkOrderStatus } from "shared";

import Text from "../../ui/Text/Text";
import RepairStatusBadge from "../RepairStatusBadge/RepairStatusBadge";

interface OpenRepairCardProps {
  href: string;
  title: string;
  subtitle: string;
  status: WorkOrderStatus;
}

const STRIPE_CLASS: Record<WorkOrderStatus, string> = {
  received: "bg-dotBlue",
  assigned: "bg-dotTeal",
  scheduled: "bg-dotGold",
  done: "bg-dotGreen",
};

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
      className="!flex overflow-hidden rounded-[8px] border border-border bg-white shadow-card transition duration-150 ease-out hover:-translate-y-0.5 hover:border-primaryHover hover:shadow-cardHover"
    >
      <Box
        aria-hidden
        className={cn("w-1 shrink-0 self-stretch", STRIPE_CLASS[status])}
      />
      <Box className="flex min-w-0 flex-1 items-center justify-between gap-4 p-4">
        <Box className="min-w-0">
          <Text className="font-semibold text-darkGrey">{title}</Text>
          <Text className="text-sm text-grey">{subtitle}</Text>
        </Box>
        <RepairStatusBadge status={status} />
      </Box>
    </Anchor>
  );
};

export default OpenRepairCard;
