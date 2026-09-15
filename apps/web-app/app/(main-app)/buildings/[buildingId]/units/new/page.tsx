"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams } from "next/navigation";
import { firstQueryError, screenLoadState } from "shared";

import { AddUnitPage, NotPermittedGate, QueryPageStatus } from "@/components";
import { reloadWindow } from "@/utils";

const AddUnitRoute = () => {
  const params = useParams<{ buildingId: string }>();
  const buildingId = params.buildingId as Id<"buildings">;
  const building = useQuery(api.buildings.get, { buildingId });

  return (
    <NotPermittedGate error={firstQueryError([building])}>
      <QueryPageStatus
        loadState={screenLoadState([building])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this building."
      >
        {building.data ? (
          <AddUnitPage
            buildingId={building.data._id}
            buildingName={building.data.name}
          />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default AddUnitRoute;
