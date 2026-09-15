"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { firstQueryError, screenLoadState } from "shared";

import { AddOwnerPage, NotPermittedGate, QueryPageStatus } from "@/components";
import { reloadWindow } from "@/utils";

const AddOwnerForBuildingRoute = () => {
  const params = useParams<{ buildingId: string }>();
  const router = useRouter();
  const buildingId = params.buildingId as Id<"buildings">;
  const building = useQuery(api.buildings.get, { buildingId });

  useEffect(() => {
    if (building.data !== undefined && building.data.ownerId !== null) {
      router.replace(`/buildings/${buildingId}`);
    }
  }, [building.data, buildingId, router]);

  return (
    <NotPermittedGate error={firstQueryError([building])}>
      <QueryPageStatus
        loadState={screenLoadState([building])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this building."
      >
        {building.data && building.data.ownerId === null ? (
          <AddOwnerPage buildingId={building.data._id} />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default AddOwnerForBuildingRoute;
