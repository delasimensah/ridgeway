"use client";

import { Box, Button } from "@mantine/core";
import React from "react";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffSidebarProps {
  displayName: string;
  onSignOut: () => void;
  isSigningOut?: boolean;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({
  displayName,
  onSignOut,
  isSigningOut = false,
}) => {
  return (
    <Box
      component="aside"
      className="flex h-full w-64 flex-col border-r border-border bg-sidebar"
    >
      <Box className="p-6">
        <Heading
          variant="section"
          className="mb-0 text-[24px] font-bold tracking-tight text-darkGrey"
        >
          Ridgeway
        </Heading>
      </Box>
      <Box component="nav" className="flex-1 space-y-1 px-4">
        <Box className="rounded-[8px] bg-primary px-4 py-2.5 font-semibold text-white">
          Home
        </Box>
      </Box>
      <Box className="border-t border-border p-4">
        <Box className="mb-3 px-4">
          <Text className="text-sm font-semibold text-darkGrey">
            {displayName}
          </Text>
          <Text className="text-xs text-grey">Staff</Text>
        </Box>
        <Button
          variant="subtle"
          onClick={onSignOut}
          loading={isSigningOut}
          className="w-full justify-start px-4 text-sm font-medium text-grey hover:text-darkGrey"
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );
};

export default StaffSidebar;
