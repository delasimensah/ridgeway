"use client";

import { Box, Button, Stack } from "@mantine/core";
import Link from "next/link";
import React from "react";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface UnitListEmptyProps {
  buildingId: string;
}

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-8 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover";

const UnitListEmpty: React.FC<UnitListEmptyProps> = ({ buildingId }) => {
  return (
    <Box className="flex min-h-[240px] flex-col items-center justify-center rounded-[8px] border border-dashed border-border bg-white p-6 text-center sm:min-h-[320px] sm:p-10 md:min-h-[400px] md:p-12">
      <Stack align="center" gap="md">
        <Heading variant="section" className="mb-0 text-[20px] font-bold">
          No units yet.
        </Heading>
        <Text className="max-w-[320px] text-grey">
          Add a unit label under this building, for example A3.
        </Text>
        <Button
          component={Link}
          href={`/buildings/${buildingId}/units/new`}
          className={PRIMARY_BUTTON}
        >
          Add unit
        </Button>
      </Stack>
    </Box>
  );
};

export default UnitListEmpty;
