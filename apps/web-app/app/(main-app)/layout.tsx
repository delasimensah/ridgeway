"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { StaffAppShell, StaffGate } from "@/components";

const StaffQuerySubscriptions = () => {
  useQuery(api.staff.getHome, {});
  useQuery(api.buildings.listForViewer, {});
  return null;
};

const MainAppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StaffGate>
      {(session) => (
        <>
          <StaffQuerySubscriptions />
          <StaffAppShell
            displayName={session.displayName}
            onSignOut={session.onSignOut}
            isSigningOut={session.isSigningOut}
          >
            {children}
          </StaffAppShell>
        </>
      )}
    </StaffGate>
  );
};

export default MainAppLayout;
