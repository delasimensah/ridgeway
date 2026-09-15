"use client";

import { FileRepairPage, NotAllowedPage } from "@/components";
import { useStaffSession } from "@/hooks";

const FileRepairRoute = () => {
  const session = useStaffSession();

  if (!session.isTenant || session.currentLease === null) {
    return (
      <NotAllowedPage
        onSignOut={session.handleSignOut}
        isSigningOut={session.isSigningOut}
      />
    );
  }

  return (
    <FileRepairPage
      unitId={session.currentLease.unitId}
      buildingName={session.currentLease.buildingName}
      unitLabel={session.currentLease.unitLabel}
    />
  );
};

export default FileRepairRoute;
