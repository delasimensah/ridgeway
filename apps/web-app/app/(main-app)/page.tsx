"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { firstQueryError, screenLoadState } from "shared";

import {
  NotPermittedGate,
  OwnerHomePage,
  StaffHomePage,
  TenantHomePage,
} from "@/components";
import { useStaffSession } from "@/hooks";
import { reloadWindow, staffGreeting } from "@/utils";

const HomeRoute = () => {
  const session = useStaffSession();
  const home = useQuery(api.staff.getHome, session.isStaff ? {} : "skip");
  const buildings = useQuery(
    api.buildings.listForViewer,
    session.isStaff || session.isOwner ? {} : "skip"
  );
  const ownerSummary = useQuery(
    api.rent.summaryForOwner,
    session.isOwner ? {} : "skip"
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

  if (session.isStaff) {
    const queries = [home, buildings, staffRepairs, staffRent];
    return (
      <NotPermittedGate error={firstQueryError(queries)}>
        <StaffHomePage
          greeting={staffGreeting(
            home.data?.displayName ?? session.displayName
          )}
          loadState={screenLoadState(queries)}
          onRetry={reloadWindow}
          buildingCount={buildings.data?.length ?? 0}
          emptyUnitCount={(buildings.data ?? []).reduce(
            (sum, row) => sum + row.emptyUnitCount,
            0
          )}
          repairs={staffRepairs.data ?? []}
          collected={staffRent.data?.collected ?? 0}
          outstanding={staffRent.data?.outstanding ?? 0}
          currency={staffRent.data?.currency ?? "GHS"}
          rentPeriods={staffRent.data?.periods ?? []}
          serverNow={staffRent.data?.serverNow ?? 0}
        />
      </NotPermittedGate>
    );
  }

  if (session.isOwner) {
    const queries = [buildings, ownerSummary];
    const moneyByBuilding = new Map(
      (ownerSummary.data?.buildings ?? []).map((row) => [row.buildingId, row])
    );
    return (
      <NotPermittedGate error={firstQueryError(queries)}>
        <OwnerHomePage
          greeting={staffGreeting(session.displayName)}
          loadState={screenLoadState(queries)}
          onRetry={reloadWindow}
          collected={ownerSummary.data?.collected ?? 0}
          outstanding={ownerSummary.data?.outstanding ?? 0}
          currency={ownerSummary.data?.currency ?? "GHS"}
          buildings={(buildings.data ?? []).map((row) => {
            const money = moneyByBuilding.get(row._id);
            return {
              _id: row._id,
              name: row.name,
              address: row.address,
              occupiedCount: row.unitCount - row.emptyUnitCount,
              unitCount: row.unitCount,
              openRepairCount: row.openRepairCount,
              collected: money?.collected ?? 0,
              outstanding: money?.outstanding ?? 0,
              currency: ownerSummary.data?.currency ?? "GHS",
            };
          })}
        />
      </NotPermittedGate>
    );
  }

  if (session.isTenant && session.currentLease !== null) {
    const queries = [repairs, rent];
    const nextRent =
      rent.data?.periods.find((period) => period.confirmedStatus !== "paid") ??
      null;
    return (
      <NotPermittedGate error={firstQueryError(queries)}>
        <TenantHomePage
          loadState={screenLoadState(queries)}
          onRetry={reloadWindow}
          unitLabel={session.currentLease.unitLabel}
          buildingName={session.currentLease.buildingName}
          address={session.currentLease.address}
          repairs={repairs.data ?? []}
          nextRent={nextRent}
          serverNow={rent.data?.serverNow ?? 0}
        />
      </NotPermittedGate>
    );
  }

  return null;
};

export default HomeRoute;
