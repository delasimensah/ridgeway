"use client";

import { Box, Button, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

import OfficeListTable, {
  type OfficeListItem,
} from "../../office/OfficeListTable/OfficeListTable";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffOfficePageProps {
  people: OfficeListItem[];
}

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-primaryHover";

const StaffOfficePage: React.FC<StaffOfficePageProps> = ({ people }) => {
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
          Staff
        </Heading>
        <Button
          component={Link}
          href="/office/new"
          className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
        >
          Add office person
        </Button>
      </Group>
      {people.length === 0 ? (
        <Text className="text-base text-grey">No office people yet.</Text>
      ) : (
        <OfficeListTable people={people} />
      )}
    </Box>
  );
};

export default StaffOfficePage;
