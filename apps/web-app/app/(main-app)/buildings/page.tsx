"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import {
  LoadingScreen,
  OwnerBuildingsPage,
  StaffBuildingsPage,
} from "@/components";
import { useStaffSession } from "@/hooks";

const BuildingsRoute = () => {
  const session = useStaffSession();
  const buildings = useQuery(api.buildings.listForViewer, {});
  const ownerSummary = useQuery(
    api.rent.summaryForOwner,
    session.isOwner ? {} : "skip"
  );

  if (session.isSessionLoading || buildings === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  if (session.isOwner) {
    if (ownerSummary === undefined) {
      return <LoadingScreen fillViewport={false} />;
    }
    const moneyByBuilding = new Map(
      ownerSummary.buildings.map((row) => [row.buildingId, row])
    );
    return (
      <OwnerBuildingsPage
        buildings={buildings.map((row) => {
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
            currency: ownerSummary.currency,
          };
        })}
      />
    );
  }

  return <StaffBuildingsPage buildings={buildings} />;
};

export default BuildingsRoute;
