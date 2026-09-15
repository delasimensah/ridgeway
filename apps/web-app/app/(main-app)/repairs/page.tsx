"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  LoadingScreen,
  NotAllowedPage,
  OwnerIssuesPage,
  StaffRepairsPage,
} from "@/components";
import { useStaffSession } from "@/hooks";

const StaffRepairsRoute = () => {
  const session = useStaffSession();
  const router = useRouter();
  const staffRepairs = useQuery(
    api.workOrders.listForStaff,
    session.isStaff ? {} : "skip"
  );
  const ownerIssues = useQuery(
    api.workOrders.listForOwner,
    session.isOwner ? {} : "skip"
  );

  useEffect(() => {
    if (!session.isSessionLoading && session.isTenant) {
      router.replace("/");
    }
  }, [router, session.isSessionLoading, session.isTenant]);

  if (session.isSessionLoading) {
    return <LoadingScreen fillViewport={false} />;
  }

  if (session.isTenant) {
    return <LoadingScreen fillViewport={false} />;
  }

  if (session.isOwner) {
    if (ownerIssues === undefined) {
      return <LoadingScreen fillViewport={false} />;
    }
    return <OwnerIssuesPage issues={ownerIssues} />;
  }

  if (!session.isStaff) {
    return (
      <NotAllowedPage
        onSignOut={session.handleSignOut}
        isSigningOut={session.isSigningOut}
      />
    );
  }

  if (staffRepairs === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  return <StaffRepairsPage repairs={staffRepairs} />;
};

export default StaffRepairsRoute;
