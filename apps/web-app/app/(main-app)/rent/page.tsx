"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react";
import { useState } from "react";
import { firstQueryError, screenLoadState } from "shared";

import {
  NotAllowedPage,
  NotPermittedGate,
  OwnerRentPage,
  QueryPageStatus,
  StaffRentPage,
  TenantRentPage,
} from "@/components";
import { useStaffSession } from "@/hooks";
import {
  getConvexErrorMessage,
  reloadWindow,
  showErrorNotification,
} from "@/utils";

const RentRoute = () => {
  const session = useStaffSession();
  const buildings = useQuery(
    api.buildings.listForViewer,
    session.isStaff ? {} : "skip"
  );
  const ownerSummary = useQuery(
    api.rent.summaryForOwner,
    session.isOwner ? {} : "skip"
  );
  const [buildingId, setBuildingId] = useState<Id<"buildings"> | "">("");
  const [periodLabel, setPeriodLabel] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "reported" | "late">(
    "all"
  );
  const [reportingPeriodId, setReportingPeriodId] = useState<string | null>(
    null
  );

  const selectedBuildingId =
    buildingId !== "" &&
    (buildings.data ?? []).some((row) => row._id === buildingId)
      ? buildingId
      : (buildings.data?.[0]?._id ?? "");

  const staffRent = useQuery(
    api.rent.listByBuilding,
    session.isStaff && selectedBuildingId !== ""
      ? {
          buildingId: selectedBuildingId,
          paginationOpts: { numItems: 50, cursor: null },
          ...(periodLabel !== null ? { periodLabel } : {}),
        }
      : "skip"
  );
  const tenantRent = useQuery(
    api.rent.listForCurrentTenant,
    session.isTenant && session.currentLease !== null ? {} : "skip"
  );
  const setConfirmedStatus = useMutation(api.rent.setConfirmedStatus);
  const reportPayment = useMutation(api.rent.reportPaymentByTenant);

  if (session.isStaff) {
    const rentQueries =
      selectedBuildingId !== "" ? [buildings, staffRent] : [buildings];
    return (
      <NotPermittedGate error={firstQueryError(rentQueries)}>
        <StaffRentPage
          loadState={screenLoadState(rentQueries)}
          onRetry={reloadWindow}
          periodLabel={periodLabel ?? staffRent.data?.periodLabel ?? ""}
          earliestPeriodLabel={staffRent.data?.earliestPeriodLabel ?? null}
          onPeriodLabelChange={setPeriodLabel}
          buildings={buildings.data ?? []}
          buildingId={selectedBuildingId}
          onBuildingIdChange={(next) => {
            setBuildingId(next as Id<"buildings">);
            setPeriodLabel(null);
          }}
          collected={staffRent.data?.collected ?? 0}
          outstanding={staffRent.data?.outstanding ?? 0}
          currency={staffRent.data?.currency ?? "GHS"}
          periods={staffRent.data?.page ?? []}
          serverNow={staffRent.data?.serverNow ?? 0}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onSetStatus={(rentPeriodId, confirmedStatus, confirmedAmount) => {
            void setConfirmedStatus({
              rentPeriodId: rentPeriodId as Id<"rentPeriods">,
              confirmedStatus,
              ...(confirmedAmount !== undefined ? { confirmedAmount } : {}),
            }).catch((error: unknown) => {
              showErrorNotification(getConvexErrorMessage(error));
            });
          }}
        />
      </NotPermittedGate>
    );
  }

  if (session.isOwner) {
    return (
      <NotPermittedGate error={firstQueryError([ownerSummary])}>
        <QueryPageStatus
          loadState={screenLoadState([ownerSummary])}
          onRetry={reloadWindow}
          failedTitle="Couldn't load rent."
        >
          <OwnerRentPage
            collected={ownerSummary.data?.collected ?? 0}
            outstanding={ownerSummary.data?.outstanding ?? 0}
            currency={ownerSummary.data?.currency ?? "GHS"}
            buildings={ownerSummary.data?.buildings ?? []}
          />
        </QueryPageStatus>
      </NotPermittedGate>
    );
  }

  if (session.isTenant && session.currentLease !== null) {
    return (
      <NotPermittedGate error={firstQueryError([tenantRent])}>
        <TenantRentPage
          loadState={screenLoadState([tenantRent])}
          onRetry={reloadWindow}
          buildingName={session.currentLease.buildingName}
          unitLabel={session.currentLease.unitLabel}
          periods={tenantRent.data?.periods ?? []}
          serverNow={tenantRent.data?.serverNow ?? 0}
          reportingPeriodId={reportingPeriodId}
          onReport={(rentPeriodId) => {
            setReportingPeriodId(rentPeriodId);
            void reportPayment({
              rentPeriodId: rentPeriodId as Id<"rentPeriods">,
            })
              .catch((error: unknown) => {
                showErrorNotification(getConvexErrorMessage(error));
              })
              .finally(() => {
                setReportingPeriodId(null);
              });
          }}
        />
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

export default RentRoute;
