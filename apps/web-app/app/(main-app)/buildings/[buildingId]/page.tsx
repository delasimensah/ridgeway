"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  BuildingDetailPage,
  LoadingScreen,
  OwnerBuildingSnapshotPage,
} from "@/components";
import { useStaffSession } from "@/hooks";

const BuildingDetailRoute = () => {
  const params = useParams<{ buildingId: string }>();
  const router = useRouter();
  const session = useStaffSession();
  const buildingId = params.buildingId as Id<"buildings">;
  const building = useQuery(api.buildings.get, { buildingId });
  const units = useQuery(
    api.units.listByBuilding,
    building ? { buildingId } : "skip"
  );
  const openRepairs = useQuery(
    api.workOrders.listForBuilding,
    building ? { buildingId } : "skip"
  );
  const ownerRent = useQuery(
    api.rent.listByBuilding,
    session.isOwner && building
      ? { buildingId, paginationOpts: { numItems: 50, cursor: null } }
      : "skip"
  );

  useEffect(() => {
    if (building === null) {
      router.replace("/buildings");
    }
  }, [building, router]);

  if (
    session.isSessionLoading ||
    building === undefined ||
    building === null ||
    units === undefined ||
    openRepairs === undefined
  ) {
    return <LoadingScreen fillViewport={false} />;
  }

  if (session.isOwner) {
    if (ownerRent === undefined) {
      return <LoadingScreen fillViewport={false} />;
    }
    return (
      <OwnerBuildingSnapshotPage
        name={building.name}
        address={building.address}
        occupiedCount={units.filter((unit) => unit.leaseId !== null).length}
        unitCount={units.length}
        openRepairCount={openRepairs.length}
        collected={ownerRent.collected}
        currency={ownerRent.currency}
        issues={openRepairs.map((repair) => ({
          _id: repair._id,
          title: repair.title,
          status: repair.status,
          tenantName: repair.tenantName,
          unitKind: repair.unitKind,
        }))}
        periods={ownerRent.page.map((period) => ({
          _id: period._id,
          unitLabel: period.unitLabel,
          tenantName: period.tenantName,
          amount: period.amount,
          currency: period.currency,
          confirmedStatus: period.confirmedStatus,
        }))}
      />
    );
  }

  return (
    <BuildingDetailPage
      buildingId={building._id}
      name={building.name}
      address={building.address}
      ownerId={building.ownerId}
      ownerName={building.ownerName}
      units={units}
      openRepairs={openRepairs}
    />
  );
};

export default BuildingDetailRoute;
