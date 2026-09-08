"use client";

import { Stack } from "@mantine/core";
import React from "react";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffHomePageProps {
  greeting: string;
}

const StaffHomePage: React.FC<StaffHomePageProps> = ({ greeting }) => {
  return (
    <Stack gap={0}>
      <Heading
        variant="page"
        className="mb-4 text-[24px] font-bold text-darkGrey sm:mb-6 sm:text-[28px] md:text-[32px]"
      >
        {greeting}
      </Heading>
      <Text className="text-base text-grey">
        Buildings and repairs will show here.
      </Text>
    </Stack>
  );
};

export default StaffHomePage;
