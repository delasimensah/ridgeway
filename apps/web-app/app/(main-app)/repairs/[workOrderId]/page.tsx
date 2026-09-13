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
  const fieldWorkers = useQuery(
    api.field.listForStaff,
    session.isStaff ? {} : "skip"
  );

  useEffect(() => {
    if (ticket === null) {
      router.replace(session.isStaff ? "/repairs" : "/");
    }
  }, [router, session.isStaff, ticket]);

  if (
    session.isSessionLoading ||
    ticket === undefined ||
    ticket === null ||
    (session.isStaff && fieldWorkers === undefined)
  ) {
    return <LoadingScreen fillViewport={false} />;
  }

  if (session.isStaff) {
    return (
      <StaffRepairDetailPage
        workOrderId={ticket._id}
        title={ticket.title}
        description={ticket.description}
        status={ticket.status}
        category={ticket.category}
        unitLabel={ticket.unitLabel}
        buildingName={ticket.buildingName}
        buildingId={ticket.buildingId}
        tenantName={ticket.tenantName}
        assigneeName={ticket.assigneeName}
        scheduledFor={ticket.scheduledFor}
        reportedAt={ticket.reportedAt}
        canAssign={ticket.canAssign}
        canSchedule={ticket.canSchedule}
        fieldWorkers={fieldWorkers ?? []}
        photoUrls={ticket.photoUrls}
        completionPhotoUrls={ticket.completionPhotoUrls}
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
        completionPhotoUrls={ticket.completionPhotoUrls}
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
