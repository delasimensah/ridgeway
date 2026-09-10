"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  LoadingScreen,
  NotAllowedPage,
  StaffRepairDetailPage,
  TenantRepairTimelinePage,
} from "@/components";
import { useStaffSession } from "@/hooks";

const RepairDetailRoute = () => {
  const params = useParams<{ workOrderId: string }>();
  const router = useRouter();
  const session = useStaffSession();
  const workOrderId = params.workOrderId as Id<"workOrders">;
  const ticket = useQuery(
    api.workOrders.get,
    session.isStaff || session.isTenant ? { workOrderId } : "skip"
  );

  useEffect(() => {
    if (ticket === null) {
      router.replace(session.isStaff ? "/repairs" : "/");
    }
  }, [router, session.isStaff, ticket]);

  if (session.isSessionLoading || ticket === undefined || ticket === null) {
    return <LoadingScreen fillViewport={false} />;
  }

  if (session.isStaff) {
    return (
      <StaffRepairDetailPage
        title={ticket.title}
        description={ticket.description}
        status={ticket.status}
        category={ticket.category}
        unitLabel={ticket.unitLabel}
        buildingName={ticket.buildingName}
        buildingId={ticket.buildingId}
        tenantName={ticket.tenantName}
        reportedAt={ticket.reportedAt}
        photoUrls={ticket.photoUrls}
        events={ticket.events}
      />
    );
  }

  if (session.isTenant) {
    return (
      <TenantRepairTimelinePage
        workOrderId={ticket._id}
        title={ticket.title}
        description={ticket.description}
        status={ticket.status}
        category={ticket.category}
        unitLabel={ticket.unitLabel}
        buildingName={ticket.buildingName}
        reportedAt={ticket.reportedAt}
        canEditDescription={ticket.canEditDescription}
        photoUrls={ticket.photoUrls}
        events={ticket.events}
      />
    );
  }

  return (
    <NotAllowedPage
      onSignOut={session.handleSignOut}
      isSigningOut={session.isSigningOut}
    />
  );
};

export default RepairDetailRoute;
