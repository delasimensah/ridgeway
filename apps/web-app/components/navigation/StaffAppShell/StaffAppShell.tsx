"use client";

import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

import { COLORS } from "@/constants";
import { useWritesLocked } from "@/hooks";

import WritesLockedNote from "../../shared/WritesLockedNote/WritesLockedNote";
import BrandMark from "../../ui/BrandMark/BrandMark";
import StaffSidebar, { type StaffNavId } from "../StaffSidebar/StaffSidebar";

interface StaffAppShellProps {
  displayName: string;
  onSignOut: () => void;
  isSigningOut?: boolean;
  children: React.ReactNode;
}

function navFromPath(pathname: string): StaffNavId {
  if (pathname.startsWith("/buildings")) {
    return "buildings";
  }
  if (
    pathname.startsWith("/users") ||
    pathname.startsWith("/owners") ||
    pathname.startsWith("/office") ||
    pathname.startsWith("/field")
  ) {
    return "users";
  }
  if (pathname.startsWith("/tenants")) {
    return "tenants";
  }
  if (pathname.startsWith("/repairs")) {
    return "repairs";
  }
  if (pathname.startsWith("/rent")) {
    return "rent";
  }
  return "home";
}

const StaffAppShell: React.FC<StaffAppShellProps> = ({
  displayName,
  onSignOut,
  isSigningOut = false,
  children,
}) => {
  const pathname = usePathname();
  const writesLocked = useWritesLocked();
  const [opened, { toggle, close }] = useDisclosure();

  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <AppShell
      header={{ height: { base: 56, md: 0 } }}
      navbar={{
        width: 256,
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
      padding={{ base: 16, sm: 24, md: 32, lg: 48 }}
      withBorder={false}
    >
      <AppShell.Header
        hiddenFrom="md"
        withBorder={false}
        className="flex items-center border-b border-border bg-white px-4"
      >
        <Group gap="sm" wrap="nowrap" h="100%">
          <Burger
            opened={opened}
            onClick={toggle}
            size="md"
            color={COLORS.darkGrey}
            aria-label="Toggle navigation"
          />
          <BrandMark
            size="header"
            headingClassName="mb-0 text-[20px] font-bold tracking-tight text-darkGrey"
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p={0} withBorder={false}>
        <StaffSidebar
          displayName={displayName}
          onSignOut={onSignOut}
          isSigningOut={isSigningOut}
          activeNav={navFromPath(pathname)}
          onNavigate={close}
        />
      </AppShell.Navbar>
      <AppShell.Main className="animate-fadeIn bg-sidebar">
        {writesLocked ? <WritesLockedNote /> : null}
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default StaffAppShell;
