"use client";

import { Box, Button, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

import BuildingListEmpty from "../../buildings/BuildingListEmpty/BuildingListEmpty";
import BuildingListTable, {
  type BuildingListItem,
} from "../../buildings/BuildingListTable/BuildingListTable";
import Heading from "../../ui/Heading/Heading";

interface StaffBuildingsPageProps {
  buildings: BuildingListItem[];
}

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-primaryHover";

const StaffBuildingsPage: React.FC<StaffBuildingsPageProps> = ({
  buildings,
}) => {
  const isEmpty = buildings.length === 0;

  return (
    <Box className="max-w-[1200px]">
      <Group
        justify="space-between"
        align="center"
        gap="md"
        wrap="wrap"
        className="mb-6 md:mb-8"
      >
        <Heading
          variant="page"
          className="mb-0 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
        >
          Buildings
        </Heading>
        <Group gap="sm" className="w-full sm:w-auto">
          <Button
            component={Link}
            href="/owners/new"
            className="h-auto w-full rounded-[8px] border border-border bg-white px-6 py-2.5 text-[15px] font-semibold text-darkGrey hover:bg-sidebar sm:w-auto"
          >
            Add owner
          </Button>
          <Button
            component={Link}
            href="/buildings/new"
            className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
          >
            Add building
          </Button>
        </Group>
      </Group>
      {isEmpty ? (
        <BuildingListEmpty />
      ) : (
        <BuildingListTable buildings={buildings} />
      )}
    </Box>
  );
};

export default StaffBuildingsPage;
