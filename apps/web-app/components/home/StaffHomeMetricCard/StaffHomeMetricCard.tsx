"use client";

import { Anchor } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { cn } from "shared";

import Text from "../../ui/Text/Text";

interface StaffHomeMetricCardProps {
  label: string;
  value: number;
  href: string;
  valueClassName?: string;
}

const StaffHomeMetricCard: React.FC<StaffHomeMetricCardProps> = ({
  label,
  value,
  href,
  valueClassName,
}) => {
  return (
    <Anchor
      component={Link}
      href={href}
      underline="never"
      aria-label={`${label} ${value}`}
      className="!block h-full rounded-[8px] border border-border bg-white p-6 shadow-card"
    >
      <Text className="mb-1 text-sm font-medium text-grey">{label}</Text>
      <Text
        className={cn("text-[28px] font-bold text-darkGrey", valueClassName)}
      >
        {value}
      </Text>
    </Anchor>
  );
};

export default StaffHomeMetricCard;
