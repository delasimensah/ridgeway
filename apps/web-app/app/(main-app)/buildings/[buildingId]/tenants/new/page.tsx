"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AddTenantPage, LoadingScreen } from "@/components";

const AddTenantRoute = () => {
  const params = useParams<{ buildingId: string }>();
  const router = useRouter();
  const buildingId = params.buildingId as Id<"buildings">;
  const building = useQuery(api.buildings.get, { buildingId });
  const units = useQuery(
    api.units.listByBuilding,
    building ? { buildingId } : "skip"
  );

  useEffect(() => {
    if (building === null) {
      router.replace("/buildings");
      return;
    }
    if (units !== undefined && units.every((unit) => unit.leaseId !== null)) {
      router.replace(`/buildings/${buildingId}`);
    }
  }, [building, buildingId, router, units]);

  if (building === undefined || building === null || units === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  const vacantUnits = units.filter((unit) => unit.leaseId === null);
  if (vacantUnits.length === 0) {
    return <LoadingScreen fillViewport={false} />;
  }

  return (
    <AddTenantPage
      buildingId={building._id}
      buildingName={building.name}
      units={vacantUnits}
    />
  );
};

export default AddTenantRoute;
