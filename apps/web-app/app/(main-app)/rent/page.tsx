"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

import {
  LoadingScreen,
  NotAllowedPage,
  StaffRentPage,
  TenantRentPage,
} from "@/components";
import { useStaffSession } from "@/hooks";
import { getConvexErrorMessage, showErrorNotification } from "@/utils";

const RentRoute = () => {
  const session = useStaffSession();
  const buildings = useQuery(
    api.buildings.listForViewer,
    session.isStaff ? {} : "skip"
  );
  const [buildingId, setBuildingId] = useState<Id<"buildings"> | "">("");
  const [statusFilter, setStatusFilter] = useState<"all" | "reported" | "late">(
    "all"
  );
  const [reportingPeriodId, setReportingPeriodId] = useState<string | null>(
    null
  );

  const selectedBuildingId =
    buildingId !== "" && buildings?.some((row) => row._id === buildingId)
      ? buildingId
      : (buildings?.[0]?._id ?? "");

  const staffRent = useQuery(
    api.rent.listByBuilding,
    session.isStaff && selectedBuildingId !== ""
      ? {
          buildingId: selectedBuildingId,
          paginationOpts: { numItems: 50, cursor: null },
        }
      : "skip"
  );
  const tenantRent = useQuery(
    api.rent.listForCurrentTenant,
    session.isTenant && session.currentLease !== null ? {} : "skip"
  );
  const setConfirmedStatus = useMutation(api.rent.setConfirmedStatus);
  const reportPayment = useMutation(api.rent.reportPaymentByTenant);

  if (session.isSessionLoading) {
    return <LoadingScreen fillViewport={false} />;
  }

  if (session.isStaff) {
    if (
      buildings === undefined ||
      (selectedBuildingId !== "" && staffRent === undefined)
    ) {
      return <LoadingScreen fillViewport={false} />;
    }

    return (
      <StaffRentPage
        periodLabel={staffRent?.periodLabel ?? ""}
        buildings={buildings}
        buildingId={selectedBuildingId}
        onBuildingIdChange={(next) => setBuildingId(next as Id<"buildings">)}
        collected={staffRent?.collected ?? 0}
        outstanding={staffRent?.outstanding ?? 0}
        currency={staffRent?.currency ?? "GHS"}
        periods={staffRent?.page ?? []}
        serverNow={staffRent?.serverNow ?? 0}
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
    );
  }

  if (session.isTenant && session.currentLease !== null) {
    if (tenantRent === undefined) {
      return <LoadingScreen fillViewport={false} />;
    }

    return (
      <TenantRentPage
        buildingName={session.currentLease.buildingName}
        unitLabel={session.currentLease.unitLabel}
        periods={tenantRent.periods}
        serverNow={tenantRent.serverNow}
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
