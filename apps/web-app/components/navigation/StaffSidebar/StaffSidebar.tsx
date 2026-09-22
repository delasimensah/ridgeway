"use client";

import { Anchor, Box, Button } from "@mantine/core";
import {
  type Icon,
  IconBuilding,
  IconCashBanknote,
  IconHelmet,
  IconHome,
  IconIdBadge2,
  IconTool,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { cn } from "shared";

import BrandMark from "../../ui/BrandMark/BrandMark";
import PersonAvatar from "../../ui/PersonAvatar/PersonAvatar";
import Text from "../../ui/Text/Text";

export type StaffNavId =
  | "home"
  | "buildings"
  | "owners"
  | "tenants"
  | "office"
  | "field"
  | "repairs"
  | "rent";

interface StaffSidebarProps {
  displayName: string;
  onSignOut: () => void;
  isSigningOut?: boolean;
  activeNav?: StaffNavId;
  onNavigate?: () => void;
}

const NAV_ITEMS: {
  id: StaffNavId;
  href: string;
  label: string;
  Icon: Icon;
}[] = [
  { id: "home", href: "/", label: "Home", Icon: IconHome },
  {
    id: "buildings",
    href: "/buildings",
    label: "Buildings",
    Icon: IconBuilding,
  },
  { id: "owners", href: "/owners", label: "Owners", Icon: IconUser },
  { id: "tenants", href: "/tenants", label: "Tenants", Icon: IconUsers },
  { id: "office", href: "/office", label: "Staff", Icon: IconIdBadge2 },
  { id: "field", href: "/field", label: "Field workers", Icon: IconHelmet },
  { id: "repairs", href: "/repairs", label: "Repairs", Icon: IconTool },
  { id: "rent", href: "/rent", label: "Rent", Icon: IconCashBanknote },
];

const NAV_LINK_CLASS =
  "flex items-center gap-3 rounded-[8px] px-4 py-2.5 no-underline hover:bg-lightGrey";
const NAV_LINK_ACTIVE_CLASS =
  "bg-primary font-semibold text-white hover:bg-primary hover:text-white";
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
        <BrandMark
          size="nav"
          headingClassName="mb-0 text-[24px] font-bold tracking-tight text-darkGrey"
        />
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
              <item.Icon size={20} stroke={1.75} aria-hidden />
              <span>{item.label}</span>
            </Anchor>
          );
        })}
      </Box>
      <Box className="border-t border-border p-4">
        <Box className="mb-3 flex items-center gap-3 px-4">
          <PersonAvatar displayName={displayName} />
          <Box className="min-w-0">
            <Text className="truncate text-sm font-semibold text-darkGrey">
              {displayName}
            </Text>
            <Text className="text-xs text-grey">Staff</Text>
          </Box>
        </Box>
        <Button
          variant="subtle"
          onClick={onSignOut}
          loading={isSigningOut}
          className="w-full justify-start px-4 text-sm font-medium text-danger hover:text-dangerHover"
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );
};

export default StaffSidebar;
