import React from "react";
import { isNotPermittedError } from "shared";

import { useFieldSession } from "@/hooks";

import NotAllowedScreen from "../../screens/field/NotAllowedScreen/NotAllowedScreen";

interface NotPermittedGateProps {
  error?: Error;
  children: React.ReactNode;
}

const NotPermittedGate: React.FC<NotPermittedGateProps> = ({
  error,
  children,
}) => {
  const session = useFieldSession();

  if (error !== undefined && isNotPermittedError(error)) {
    return (
      <NotAllowedScreen
        isSigningOut={session.isSigningOut}
        onSignOut={() => {
          void session.handleSignOut();
        }}
      />
    );
  }

  return <>{children}</>;
};

export default NotPermittedGate;
