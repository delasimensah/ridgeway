"use client";

import { Anchor, Box, Group, SimpleGrid, Stack } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { cn, type Currency, formatMoney } from "shared";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface OwnerBuildingCardProps {
  href: string;
  name: string;
  address: string;
  occupiedCount: number;
  unitCount: number;
  openRepairCount: number;
  collected: number;
  outstanding: number;
  currency: Currency;
}

const OwnerBuildingCard: React.FC<OwnerBuildingCardProps> = ({
  href,
  name,
  address,
  occupiedCount,
  unitCount,
  openRepairCount,
  collected,
  outstanding,
  currency,
}) => {
  return (
    <Anchor
      component={Link}
      href={href}
      underline="never"
      className="group !block rounded-[8px] border border-border bg-white p-6 shadow-sm hover:border-primaryHover"
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap" mb={16}>
        <Stack gap={4} className="min-w-0">
          <Heading
            variant="card"
            className="mb-0 text-[18px] font-bold text-darkGrey group-hover:text-primaryHover"
          >
            {name}
          </Heading>
          <Text className="text-[14px] text-grey">{address}</Text>
        </Stack>
        <IconChevronRight
          size={16}
          className="shrink-0 text-border group-hover:text-primaryHover"
          aria-hidden
        />
      </Group>
      <SimpleGrid cols={2} spacing="md" className="border-t border-border pt-4">
        <Box>
          <Text className="text-[12px] font-bold uppercase tracking-wider text-grey">
            Occupancy
          </Text>
          <Text className="text-[20px] font-bold text-darkGrey">
            {`${occupiedCount}/${unitCount}`}
          </Text>
        </Box>
        <Box>
          <Text className="text-[12px] font-bold uppercase tracking-wider text-grey">
            Issues
          </Text>
          <Text className="text-[20px] font-bold text-darkGrey">
            {openRepairCount}
          </Text>
        </Box>
      </SimpleGrid>
      <Box className="mt-6 border-t border-border pt-4">
        <Group justify="space-between" mb={4}>
          <Text className="text-[13px] text-grey">Rent collected</Text>
          <Text className="text-[14px] font-bold text-darkGrey">
            {formatMoney(collected, currency)}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text className="text-[13px] text-grey">Outstanding</Text>
          <Text
            className={cn(
              "text-[14px] font-bold",
              outstanding > 0 ? "text-accent" : "text-darkGrey"
            )}
          >
            {formatMoney(outstanding, currency)}
          </Text>
        </Group>
      </Box>
    </Anchor>
  );
};

export default OwnerBuildingCard;
