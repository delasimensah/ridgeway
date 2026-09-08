"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AddOwnerPage, LoadingScreen } from "@/components";

const AddOwnerForBuildingRoute = () => {
  const params = useParams<{ buildingId: string }>();
  const router = useRouter();
  const buildingId = params.buildingId as Id<"buildings">;
  const building = useQuery(api.buildings.get, { buildingId });

  useEffect(() => {
    if (building === null) {
      router.replace("/buildings");
    }
  }, [building, router]);

  if (building === undefined || building === null) {
    return <LoadingScreen fillViewport={false} />;
  }

  return <AddOwnerPage buildingId={building._id} />;
};

export default AddOwnerForBuildingRoute;
