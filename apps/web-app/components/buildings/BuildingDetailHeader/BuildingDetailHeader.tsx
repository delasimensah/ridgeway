"use client";

import { Anchor, Box, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface BuildingDetailHeaderProps {
  buildingId: string;
  name: string;
  address: string;
  ownerId?: string | null;
  ownerName?: string | null;
}

const BuildingDetailHeader: React.FC<BuildingDetailHeaderProps> = ({
  buildingId,
  name,
  address,
  ownerId = null,
  ownerName = null,
}) => {
  return (
    <Box className="mb-8 md:mb-12">
      <Group gap={8} className="mb-2 text-[14px] font-medium">
        <Anchor
          component={Link}
          href="/buildings"
          underline="never"
          className="text-grey hover:text-darkGrey"
        >
          Buildings
        </Anchor>
        <Text component="span" className="text-grey">
          /
        </Text>
        <Text component="span" className="text-grey">
          {name}
        </Text>
      </Group>
      <Group
        justify="space-between"
        align="flex-end"
        gap="md"
        wrap="wrap"
        className="mb-2"
      >
        <Heading
          variant="page"
          className="mb-0 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
        >
          {name}
        </Heading>
        <Group gap="md">
          <Anchor
            component={Link}
            href={`/buildings/${buildingId}/edit`}
            underline="never"
            className="text-[15px] font-semibold text-grey hover:text-darkGrey"
          >
            Edit building
          </Anchor>
          {ownerName === null ? (
            <Anchor
              component={Link}
              href={`/buildings/${buildingId}/owners/new`}
              underline="never"
              className="text-[15px] font-semibold text-grey hover:text-darkGrey"
            >
              Add owner
            </Anchor>
          ) : null}
        </Group>
      </Group>
      <Text className="text-base text-grey">
        {ownerName !== null && ownerId !== null ? (
          <>
            {address} · Owner:{" "}
            <Anchor
              component={Link}
              href={`/owners/${ownerId}/edit`}
              underline="never"
              className="text-grey hover:text-darkGrey"
            >
              {ownerName}
            </Anchor>
          </>
        ) : (
          address
        )}
      </Text>
    </Box>
  );
};

export default BuildingDetailHeader;
