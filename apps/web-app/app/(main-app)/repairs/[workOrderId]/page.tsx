"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams } from "next/navigation";
import { firstQueryError, screenLoadState } from "shared";

import {
  NotAllowedPage,
  NotPermittedGate,
  QueryPageStatus,
  StaffRepairDetailPage,
  TenantRepairTimelinePage,
} from "@/components";
import { useStaffSession } from "@/hooks";
import { reloadWindow } from "@/utils";

const RepairDetailRoute = () => {
  const params = useParams<{ workOrderId: string }>();
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

  if (session.isStaff) {
    return (
      <NotPermittedGate error={firstQueryError([ticket, fieldWorkers])}>
        <QueryPageStatus
          loadState={screenLoadState([ticket, fieldWorkers])}
          onRetry={reloadWindow}
          failedTitle="Couldn't load this repair."
        >
          {ticket.data ? (
            <StaffRepairDetailPage
              workOrderId={ticket.data._id}
              title={ticket.data.title}
              description={ticket.data.description}
              status={ticket.data.status}
              category={ticket.data.category}
              unitLabel={ticket.data.unitLabel}
              buildingName={ticket.data.buildingName}
              buildingId={ticket.data.buildingId}
              tenantName={ticket.data.tenantName}
              assigneeName={ticket.data.assigneeName}
              scheduledFor={ticket.data.scheduledFor}
              reportedAt={ticket.data.reportedAt}
              canAssign={ticket.data.canAssign}
              canSchedule={ticket.data.canSchedule}
              fieldWorkers={fieldWorkers.data ?? []}
              photoUrls={ticket.data.photoUrls}
              completionPhotoUrls={ticket.data.completionPhotoUrls}
              events={ticket.data.events}
            />
          ) : null}
        </QueryPageStatus>
      </NotPermittedGate>
    );
  }

  if (session.isTenant) {
    const loadState = screenLoadState([ticket]);
    return (
      <NotPermittedGate error={firstQueryError([ticket])}>
        {loadState === "ready" && ticket.data === null ? null : (
          <TenantRepairTimelinePage
            loadState={loadState}
            onRetry={reloadWindow}
            workOrderId={ticket.data?._id ?? workOrderId}
            title={ticket.data?.title ?? ""}
            description={ticket.data?.description ?? ""}
            status={ticket.data?.status ?? "received"}
            category={ticket.data?.category ?? null}
            unitLabel={ticket.data?.unitLabel ?? ""}
            buildingName={ticket.data?.buildingName ?? ""}
            reportedAt={ticket.data?.reportedAt ?? 0}
            canEditDescription={ticket.data?.canEditDescription ?? false}
            photoUrls={ticket.data?.photoUrls ?? []}
            completionPhotoUrls={ticket.data?.completionPhotoUrls ?? []}
            events={ticket.data?.events ?? []}
          />
        )}
      </NotPermittedGate>
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
