"use client";

import { Box, Button } from "@mantine/core";
import React from "react";

import { useWritesLocked } from "@/hooks";

import WritesLockedNote from "../../shared/WritesLockedNote/WritesLockedNote";
import BrandMark from "../../ui/BrandMark/BrandMark";
import PersonAvatar from "../../ui/PersonAvatar/PersonAvatar";
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
  const writesLocked = useWritesLocked();

  return (
    <Box className="flex min-h-screen flex-col bg-white">
      <Box
        component="header"
        className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-white px-4 sm:h-16 sm:px-8"
      >
        <BrandMark
          size="header"
          href="/"
          headingClassName="mb-0 text-[20px] font-bold tracking-tight text-darkGrey"
        />
        <Box className="flex items-center gap-3 sm:gap-6">
          <Box className="flex items-center gap-2">
            <PersonAvatar displayName={displayName} size={28} />
            <Text className="hidden text-sm font-semibold text-darkGrey sm:block">
              {displayName}
            </Text>
          </Box>
          <Button
            variant="subtle"
            onClick={onSignOut}
            loading={isSigningOut}
            className="h-auto px-0 text-sm font-medium text-danger hover:bg-transparent hover:text-dangerHover"
          >
            Sign out
          </Button>
        </Box>
      </Box>
      <Box component="main" className="w-full flex-1">
        {writesLocked ? (
          <Box className="px-4 pt-6 sm:px-8">
            <WritesLockedNote />
          </Box>
        ) : null}
        {children}
      </Box>
    </Box>
  );
};

export default TenantAppShell;
