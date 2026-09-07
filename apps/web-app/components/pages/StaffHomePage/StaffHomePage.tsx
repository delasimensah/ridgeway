"use client";

import { Box } from "@mantine/core";
import React from "react";

import StaffSidebar from "../../navigation/StaffSidebar/StaffSidebar";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffHomePageProps {
  greeting: string;
  displayName: string;
  onSignOut: () => void;
  isSigningOut?: boolean;
}

const StaffHomePage: React.FC<StaffHomePageProps> = ({
  greeting,
  displayName,
  onSignOut,
  isSigningOut = false,
}) => {
  return (
    <Box className="flex min-h-screen bg-white">
      <Box className="fixed h-full">
        <StaffSidebar
          displayName={displayName}
          onSignOut={onSignOut}
          isSigningOut={isSigningOut}
        />
      </Box>
      <Box component="main" className="ml-64 flex-1 p-12">
        <Heading
          variant="page"
          className="mb-6 text-[32px] font-bold text-darkGrey"
        >
          {greeting}
        </Heading>
        <Text className="text-base text-grey">
          Buildings and repairs will show here.
        </Text>
      </Box>
    </Box>
  );
};

export default StaffHomePage;
