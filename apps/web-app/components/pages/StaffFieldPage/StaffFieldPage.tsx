"use client";

import { Box, Button, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

import FieldListTable, {
  type FieldListItem,
} from "../../field/FieldListTable/FieldListTable";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffFieldPageProps {
  people: FieldListItem[];
}

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-primaryHover";

const StaffFieldPage: React.FC<StaffFieldPageProps> = ({ people }) => {
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
          Field workers
        </Heading>
        <Button
          component={Link}
          href="/field/new"
          className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
        >
          Add field worker
        </Button>
      </Group>
      {people.length === 0 ? (
        <Text className="text-base text-grey">No field workers yet.</Text>
      ) : (
        <FieldListTable people={people} />
      )}
    </Box>
  );
};

export default StaffFieldPage;
