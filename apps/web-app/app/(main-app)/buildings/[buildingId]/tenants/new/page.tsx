"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { firstQueryError, screenLoadState } from "shared";

import { AddTenantPage, NotPermittedGate, QueryPageStatus } from "@/components";
import { reloadWindow } from "@/utils";

const AddTenantRoute = () => {
  const params = useParams<{ buildingId: string }>();
  const router = useRouter();
  const buildingId = params.buildingId as Id<"buildings">;
  const building = useQuery(api.buildings.get, { buildingId });
  const units = useQuery(
    api.units.listByBuilding,
    building.data ? { buildingId } : "skip"
  );

  useEffect(() => {
    if (units.isSuccess && units.data.every((unit) => unit.leaseId !== null)) {
      router.replace(`/buildings/${buildingId}`);
    }
  }, [buildingId, router, units.data, units.isSuccess]);

  const vacantUnits = (units.data ?? []).filter(
    (unit) => unit.leaseId === null
  );

  return (
    <NotPermittedGate error={firstQueryError([building, units])}>
      <QueryPageStatus
        loadState={screenLoadState([building, units])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this building."
      >
        {building.data && vacantUnits.length > 0 ? (
          <AddTenantPage
            buildingId={building.data._id}
            buildingName={building.data.name}
            units={vacantUnits}
          />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default AddTenantRoute;
