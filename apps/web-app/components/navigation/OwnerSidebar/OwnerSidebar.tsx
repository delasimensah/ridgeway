"use client";

import { Anchor, Box, Button } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { cn } from "shared";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

export type OwnerNavId = "home";

interface OwnerSidebarProps {
  displayName: string;
  onSignOut: () => void;
  isSigningOut?: boolean;
  activeNav?: OwnerNavId;
  onNavigate?: () => void;
}

const NAV_LINK_CLASS =
  "block rounded-[8px] px-4 py-2.5 no-underline hover:bg-lightGrey";
const NAV_LINK_ACTIVE_CLASS =
  "bg-primary font-semibold text-white hover:bg-primary";
const NAV_LINK_IDLE_CLASS = "font-medium text-darkGrey";

const OwnerSidebar: React.FC<OwnerSidebarProps> = ({
  displayName,
  onSignOut,
  isSigningOut = false,
  activeNav = "home",
  onNavigate,
}) => {
  const isHomeActive = activeNav === "home";

  return (
    <Box className="flex h-full w-full flex-col border-r border-border bg-sidebar">
      <Box className="p-6">
        <Heading
          variant="section"
          className="mb-0 text-[24px] font-bold tracking-tight text-darkGrey"
        >
          Ridgeway
        </Heading>
      </Box>
      <Box component="nav" className="flex-1 space-y-1 px-4">
        <Anchor
          component={Link}
          href="/"
          underline="never"
          onClick={onNavigate}
          className={cn(
            NAV_LINK_CLASS,
            isHomeActive ? NAV_LINK_ACTIVE_CLASS : NAV_LINK_IDLE_CLASS
          )}
        >
          Home
        </Anchor>
      </Box>
      <Box className="border-t border-border p-4">
        <Box className="mb-3 px-4">
          <Text className="text-sm font-semibold text-darkGrey">
            {displayName}
          </Text>
          <Text className="text-xs text-grey">Owner</Text>
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

export default OwnerSidebar;
