"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import {
  LoadingScreen,
  NotAllowedPage,
  OwnerAppShell,
  StaffAppShell,
} from "@/components";
import { useStaffSession } from "@/hooks";

const StaffQuerySubscriptions = () => {
  useQuery(api.staff.getHome, {});
  useQuery(api.buildings.listForViewer, {});
  return null;
};

const MainAppLayout = ({ children }: { children: React.ReactNode }) => {
  const session = useStaffSession();

  if (session.isSessionLoading) {
    return <LoadingScreen />;
  }

  if (session.isStaff) {
    return (
      <>
        <StaffQuerySubscriptions />
        <StaffAppShell
          displayName={session.displayName}
          onSignOut={session.handleSignOut}
          isSigningOut={session.isSigningOut}
        >
          {children}
        </StaffAppShell>
      </>
    );
  }

  if (session.isOwner) {
    return (
      <OwnerAppShell
        displayName={session.displayName}
        onSignOut={session.handleSignOut}
        isSigningOut={session.isSigningOut}
      >
        {children}
      </OwnerAppShell>
    );
  }

  return (
    <NotAllowedPage
      onSignOut={session.handleSignOut}
      isSigningOut={session.isSigningOut}
    />
  );
};

export default MainAppLayout;
