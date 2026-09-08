"use client";

import React from "react";

import { useStaffSession } from "@/hooks";

import NotAllowedPage from "../../pages/NotAllowedPage/NotAllowedPage";
import LoadingScreen from "../../shared/LoadingScreen/LoadingScreen";

interface StaffGateProps {
  children: (session: {
    displayName: string;
    onSignOut: () => void;
    isSigningOut: boolean;
  }) => React.ReactNode;
}

const StaffGate: React.FC<StaffGateProps> = ({ children }) => {
  const session = useStaffSession();

  if (session.isSessionLoading) {
    return <LoadingScreen />;
  }

  if (!session.isStaff) {
    return (
      <NotAllowedPage
        onSignOut={session.handleSignOut}
        isSigningOut={session.isSigningOut}
      />
    );
  }

  return (
    <>
      {children({
        displayName: session.displayName,
        onSignOut: session.handleSignOut,
        isSigningOut: session.isSigningOut,
      })}
    </>
  );
};

export default StaffGate;
