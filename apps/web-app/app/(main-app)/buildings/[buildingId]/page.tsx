"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams } from "next/navigation";
import { firstQueryError, screenLoadState } from "shared";

import {
  BuildingDetailPage,
  NotPermittedGate,
  OwnerBuildingSnapshotPage,
  QueryPageStatus,
} from "@/components";
import { useStaffSession } from "@/hooks";
import { reloadWindow } from "@/utils";

const BuildingDetailRoute = () => {
  const params = useParams<{ buildingId: string }>();
  const session = useStaffSession();
  const buildingId = params.buildingId as Id<"buildings">;
  const building = useQuery(api.buildings.get, { buildingId });
  const units = useQuery(
    api.units.listByBuilding,
    building.data ? { buildingId } : "skip"
  );
  const openRepairs = useQuery(
    api.workOrders.listForBuilding,
    building.data ? { buildingId } : "skip"
  );
  const ownerRent = useQuery(
    api.rent.listByBuilding,
    session.isOwner && building.data
      ? { buildingId, paginationOpts: { numItems: 50, cursor: null } }
      : "skip"
  );

  const error = firstQueryError([building, units, openRepairs, ownerRent]);

  if (session.isOwner && building.data) {
    return (
      <NotPermittedGate error={error}>
        <QueryPageStatus
          loadState={screenLoadState([building, units, openRepairs, ownerRent])}
          onRetry={reloadWindow}
          failedTitle="Couldn't load this building."
        >
          <OwnerBuildingSnapshotPage
            name={building.data.name}
            address={building.data.address}
            occupiedCount={
              (units.data ?? []).filter((unit) => unit.leaseId !== null).length
            }
            unitCount={units.data?.length ?? 0}
            openRepairCount={openRepairs.data?.length ?? 0}
            collected={ownerRent.data?.collected ?? 0}
            currency={ownerRent.data?.currency ?? "GHS"}
            issues={(openRepairs.data ?? []).map((repair) => ({
              _id: repair._id,
              title: repair.title,
              status: repair.status,
              tenantName: repair.tenantName,
              unitKind: repair.unitKind,
            }))}
            periods={(ownerRent.data?.page ?? []).map((period) => ({
              _id: period._id,
              unitLabel: period.unitLabel,
              tenantName: period.tenantName,
              amount: period.amount,
              currency: period.currency,
              confirmedStatus: period.confirmedStatus,
            }))}
          />
        </QueryPageStatus>
      </NotPermittedGate>
    );
  }

  return (
    <NotPermittedGate error={error}>
      <QueryPageStatus
        loadState={screenLoadState([building])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this building."
      >
        {building.data ? (
          <BuildingDetailPage
            buildingId={building.data._id}
            name={building.data.name}
            address={building.data.address}
            ownerId={building.data.ownerId}
            ownerName={building.data.ownerName}
            units={units.data ?? []}
            openRepairs={openRepairs.data ?? []}
            loadState={screenLoadState([units, openRepairs])}
            onRetry={reloadWindow}
          />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default BuildingDetailRoute;
