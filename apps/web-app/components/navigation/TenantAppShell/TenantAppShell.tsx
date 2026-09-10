"use client";

import { Box, Button } from "@mantine/core";
import Link from "next/link";
import React from "react";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface TenantAppShellProps {
  displayName: string;
  onSignOut: () => void;
  isSigningOut?: boolean;
  children: React.ReactNode;
}

const TenantAppShell: React.FC<TenantAppShellProps> = ({
  displayName,
  onSignOut,
  isSigningOut = false,
  children,
}) => {
  return (
    <Box className="flex min-h-screen flex-col bg-white">
      <Box
        component="header"
        className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-white px-4 sm:h-16 sm:px-8"
      >
        <Heading
          variant="section"
          className="mb-0 text-[20px] font-bold tracking-tight text-darkGrey"
        >
          <Box component={Link} href="/" className="text-inherit no-underline">
            Ridgeway
          </Box>
        </Heading>
        <Box className="flex items-center gap-3 sm:gap-6">
          <Text className="text-sm font-semibold text-darkGrey">
            {displayName}
          </Text>
          <Button
            variant="subtle"
            onClick={onSignOut}
            loading={isSigningOut}
            className="h-auto px-0 text-sm font-medium text-grey hover:bg-transparent hover:text-darkGrey"
          >
            Sign out
          </Button>
        </Box>
      </Box>
      <Box component="main" className="w-full flex-1">
        {children}
      </Box>
    </Box>
  );
};

export default TenantAppShell;
