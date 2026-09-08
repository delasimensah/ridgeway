"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { BuildingDetailPage, LoadingScreen } from "@/components";

const BuildingDetailRoute = () => {
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
    }
  }, [building, router]);

  if (building === undefined || building === null || units === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  return (
    <BuildingDetailPage
      buildingId={building._id}
      name={building.name}
      address={building.address}
      units={units}
    />
  );
};

export default BuildingDetailRoute;
