"use client";

import React from "react";
import { isNotPermittedError } from "shared";

import { useStaffSession } from "@/hooks";

import NotAllowedPage from "../../pages/NotAllowedPage/NotAllowedPage";

interface NotPermittedGateProps {
  error?: Error;
  children: React.ReactNode;
}

const NotPermittedGate: React.FC<NotPermittedGateProps> = ({
  error,
  children,
}) => {
  const session = useStaffSession();

  if (error !== undefined && isNotPermittedError(error)) {
    return (
      <NotAllowedPage
        onSignOut={session.handleSignOut}
        isSigningOut={session.isSigningOut}
      />
    );
  }

  return <>{children}</>;
};

export default NotPermittedGate;
