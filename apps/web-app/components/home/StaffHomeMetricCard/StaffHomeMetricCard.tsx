"use client";

import { Anchor, Box } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { cn } from "shared";

import Text from "../../ui/Text/Text";

interface StaffHomeMetricCardProps {
  label: string;
  value: number;
  href: string;
  Icon: Icon;
  valueClassName?: string;
}

const StaffHomeMetricCard: React.FC<StaffHomeMetricCardProps> = ({
  label,
  value,
  href,
  Icon,
  valueClassName,
}) => {
  return (
    <Anchor
      component={Link}
      href={href}
      underline="never"
      aria-label={`${label} ${value}`}
      className="!block h-full rounded-[8px] border border-border bg-white p-6 shadow-card transition duration-150 ease-out hover:-translate-y-0.5 hover:border-primaryHover hover:shadow-cardHover"
    >
      <Box
        aria-hidden
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-[8px] bg-sidebar text-darkGrey"
      >
        <Icon size={18} stroke={1.75} />
      </Box>
      <Text className="mb-1 text-sm font-medium text-grey">{label}</Text>
      <Text
        className={cn(
          "text-[40px] font-semibold tabular-nums leading-none tracking-tight text-darkGrey",
          valueClassName
        )}
      >
        {value}
      </Text>
    </Anchor>
  );
};

export default StaffHomeMetricCard;
