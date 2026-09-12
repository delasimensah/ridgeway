"use client";

import { Anchor, Box, Button } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { cn } from "shared";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

export type StaffNavId =
  "home" | "buildings" | "owners" | "tenants" | "office" | "repairs";

interface StaffSidebarProps {
  displayName: string;
  onSignOut: () => void;
  isSigningOut?: boolean;
  activeNav?: StaffNavId;
  onNavigate?: () => void;
}

const NAV_ITEMS: { id: StaffNavId; href: string; label: string }[] = [
  { id: "home", href: "/", label: "Home" },
  { id: "buildings", href: "/buildings", label: "Buildings" },
  { id: "owners", href: "/owners", label: "Owners" },
  { id: "tenants", href: "/tenants", label: "Tenants" },
  { id: "office", href: "/office", label: "Office" },
  { id: "repairs", href: "/repairs", label: "Repairs" },
];

const NAV_LINK_CLASS =
  "block rounded-[8px] px-4 py-2.5 no-underline hover:bg-lightGrey";
const NAV_LINK_ACTIVE_CLASS =
  "bg-primary font-semibold text-white hover:bg-primary";
const NAV_LINK_IDLE_CLASS = "font-medium text-darkGrey";

const StaffSidebar: React.FC<StaffSidebarProps> = ({
  displayName,
  onSignOut,
  isSigningOut = false,
  activeNav = "home",
  onNavigate,
}) => {
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
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeNav;
          return (
            <Anchor
              key={item.id}
              component={Link}
              href={item.href}
              underline="never"
              onClick={onNavigate}
              className={cn(
                NAV_LINK_CLASS,
                isActive ? NAV_LINK_ACTIVE_CLASS : NAV_LINK_IDLE_CLASS
              )}
            >
              {item.label}
            </Anchor>
          );
        })}
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
