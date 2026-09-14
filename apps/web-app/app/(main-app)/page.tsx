"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import {
  LoadingScreen,
  OwnerHomePage,
  StaffHomePage,
  TenantHomePage,
} from "@/components";
import { useStaffSession } from "@/hooks";
import { staffGreeting } from "@/utils";

const HomeRoute = () => {
  const session = useStaffSession();
  const home = useQuery(api.staff.getHome, session.isStaff ? {} : "skip");
  const buildings = useQuery(
    api.buildings.listForViewer,
    session.isStaff || session.isOwner ? {} : "skip"
  );
  const staffRepairs = useQuery(
    api.workOrders.listForStaff,
    session.isStaff ? {} : "skip"
  );
  const staffRent = useQuery(
    api.rent.listForStaff,
    session.isStaff ? {} : "skip"
  );
  const repairs = useQuery(
    api.workOrders.listForCurrentTenant,
    session.isTenant ? {} : "skip"
  );
  const rent = useQuery(
    api.rent.listForCurrentTenant,
    session.isTenant && session.currentLease !== null ? {} : "skip"
  );

  if (session.isSessionLoading) {
    return <LoadingScreen fillViewport={false} />;
  }

  if (session.isStaff) {
    if (
      home === undefined ||
      buildings === undefined ||
      staffRepairs === undefined ||
      staffRent === undefined
    ) {
      return <LoadingScreen fillViewport={false} />;
    }
    return (
      <StaffHomePage
        greeting={staffGreeting(home.displayName)}
        buildingCount={buildings.length}
        emptyUnitCount={buildings.reduce(
          (sum, row) => sum + row.emptyUnitCount,
          0
        )}
        repairs={staffRepairs}
        collected={staffRent.collected}
        outstanding={staffRent.outstanding}
        currency={staffRent.currency}
        rentPeriods={staffRent.periods}
        serverNow={staffRent.serverNow}
      />
    );
  }

  if (session.isOwner) {
    if (buildings === undefined) {
      return <LoadingScreen fillViewport={false} />;
    }
    return (
      <OwnerHomePage
        greeting={staffGreeting(session.displayName)}
        buildings={buildings}
      />
    );
  }

  if (session.isTenant) {
    if (
      repairs === undefined ||
      rent === undefined ||
      session.currentLease === null
    ) {
      return <LoadingScreen fillViewport={false} />;
    }
    const nextRent =
      rent.periods.find((period) => period.confirmedStatus !== "paid") ?? null;
    return (
      <TenantHomePage
        unitLabel={session.currentLease.unitLabel}
        buildingName={session.currentLease.buildingName}
        address={session.currentLease.address}
        repairs={repairs}
        nextRent={nextRent}
        serverNow={rent.serverNow}
      />
    );
  }

  return <LoadingScreen fillViewport={false} />;
};

export default HomeRoute;
