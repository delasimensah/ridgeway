"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { firstQueryError, screenLoadState } from "shared";

import { AddUnitPage, NotPermittedGate, QueryPageStatus } from "@/components";
import { reloadWindow } from "@/utils";

const EditUnitRoute = () => {
  const params = useParams<{ buildingId: string; unitId: string }>();
  const router = useRouter();
  const buildingId = params.buildingId as Id<"buildings">;
  const unitId = params.unitId as Id<"units">;
  const building = useQuery(api.buildings.get, { buildingId });
  const unit = useQuery(api.units.get, { unitId });

  useEffect(() => {
    if (unit.isSuccess && unit.data === null) {
      router.replace(`/buildings/${buildingId}`);
      return;
    }
    if (
      unit.data !== undefined &&
      unit.data !== null &&
      unit.data.buildingId !== buildingId
    ) {
      router.replace(`/buildings/${buildingId}`);
    }
  }, [buildingId, router, unit.data, unit.isSuccess]);

  return (
    <NotPermittedGate error={firstQueryError([building, unit])}>
      <QueryPageStatus
        loadState={screenLoadState([building, unit])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this unit."
      >
        {building.data && unit.data && unit.data.buildingId === buildingId ? (
          <AddUnitPage
            buildingId={building.data._id}
            buildingName={building.data.name}
            unitId={unit.data._id}
            initialValues={{
              label: unit.data.label,
              kind: unit.data.kind,
            }}
          />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default EditUnitRoute;
