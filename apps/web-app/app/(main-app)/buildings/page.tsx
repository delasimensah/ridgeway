"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { firstQueryError, screenLoadState } from "shared";

import {
  NotPermittedGate,
  OwnerBuildingsPage,
  StaffBuildingsPage,
} from "@/components";
import { useStaffSession } from "@/hooks";
import { reloadWindow } from "@/utils";

const BuildingsRoute = () => {
  const session = useStaffSession();
  const buildings = useQuery(
    api.buildings.listForViewer,
    session.isStaff || session.isOwner ? {} : "skip"
  );
  const ownerSummary = useQuery(
    api.rent.summaryForOwner,
    session.isOwner ? {} : "skip"
  );

  if (session.isOwner) {
    const moneyByBuilding = new Map(
      (ownerSummary.data?.buildings ?? []).map((row) => [row.buildingId, row])
    );

    return (
      <NotPermittedGate error={firstQueryError([buildings, ownerSummary])}>
        <OwnerBuildingsPage
          loadState={screenLoadState([buildings, ownerSummary])}
          onRetry={reloadWindow}
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

  return (
    <NotPermittedGate error={firstQueryError([buildings])}>
      <StaffBuildingsPage
        buildings={buildings.data ?? []}
        loadState={screenLoadState([buildings])}
        onRetry={reloadWindow}
      />
    </NotPermittedGate>
  );
};

export default BuildingsRoute;
