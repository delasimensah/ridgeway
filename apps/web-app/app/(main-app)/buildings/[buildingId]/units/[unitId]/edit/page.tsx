"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AddUnitPage, LoadingScreen } from "@/components";

const EditUnitRoute = () => {
  const params = useParams<{ buildingId: string; unitId: string }>();
  const router = useRouter();
  const buildingId = params.buildingId as Id<"buildings">;
  const unitId = params.unitId as Id<"units">;
  const building = useQuery(api.buildings.get, { buildingId });
  const unit = useQuery(api.units.get, { unitId });

  useEffect(() => {
    if (building === null) {
      router.replace("/buildings");
      return;
    }
    if (
      unit === null ||
      (unit !== undefined && unit.buildingId !== buildingId)
    ) {
      router.replace(`/buildings/${buildingId}`);
    }
  }, [building, buildingId, router, unit]);

  if (
    building === undefined ||
    building === null ||
    unit === undefined ||
    unit === null ||
    unit.buildingId !== buildingId
  ) {
    return <LoadingScreen fillViewport={false} />;
  }

  return (
    <AddUnitPage
      buildingId={building._id}
      buildingName={building.name}
      unitId={unit._id}
      initialValues={{
        label: unit.label,
        kind: unit.kind,
      }}
    />
  );
};

export default EditUnitRoute;
