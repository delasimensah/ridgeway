"use client";

import { FileRepairPage, LoadingScreen, NotAllowedPage } from "@/components";
import { useStaffSession } from "@/hooks";

const FileRepairRoute = () => {
  const session = useStaffSession();

  if (session.isSessionLoading) {
    return <LoadingScreen fillViewport={false} />;
  }

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
