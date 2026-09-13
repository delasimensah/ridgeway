"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import {
  LoadingScreen,
  NotAllowedPage,
  OwnerAppShell,
  StaffAppShell,
  TenantAppShell,
  TenantLeaseEndedPage,
} from "@/components";
import { StaffSessionProvider, useStaffSession } from "@/hooks";

const StaffQuerySubscriptions = () => {
  useQuery(api.staff.getHome, {});
  useQuery(api.buildings.listForViewer, {});
  useQuery(api.owners.listForStaff, {});
  useQuery(api.leases.listForStaff, {});
  useQuery(api.staff.listForStaff, {});
  useQuery(api.field.listForStaff, {});
  useQuery(api.workOrders.listForStaff, {});
  return null;
};

const MainAppShell = ({ children }: { children: React.ReactNode }) => {
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

  if (session.isTenant) {
    if (session.currentLease === null) {
      return (
        <TenantLeaseEndedPage
          unitLabel={session.endedLease?.unitLabel ?? ""}
          buildingName={session.endedLease?.buildingName ?? ""}
          onSignOut={session.handleSignOut}
          isSigningOut={session.isSigningOut}
        />
      );
    }

    return (
      <TenantAppShell
        displayName={session.displayName}
        onSignOut={session.handleSignOut}
        isSigningOut={session.isSigningOut}
      >
        {children}
      </TenantAppShell>
    );
  }

  return (
    <NotAllowedPage
      onSignOut={session.handleSignOut}
      isSigningOut={session.isSigningOut}
    />
  );
};

const MainAppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StaffSessionProvider>
      <MainAppShell>{children}</MainAppShell>
    </StaffSessionProvider>
  );
};

export default MainAppLayout;
