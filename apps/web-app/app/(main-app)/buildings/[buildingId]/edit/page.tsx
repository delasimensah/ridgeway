"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AddBuildingPage, LoadingScreen } from "@/components";

const EditBuildingRoute = () => {
  const params = useParams<{ buildingId: string }>();
  const router = useRouter();
  const buildingId = params.buildingId as Id<"buildings">;
  const building = useQuery(api.buildings.get, { buildingId });
  const owners = useQuery(api.owners.listForStaff);

  useEffect(() => {
    if (building === null) {
      router.replace("/buildings");
    }
  }, [building, router]);

  if (building === undefined || building === null || owners === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  return (
    <AddBuildingPage
      buildingId={building._id}
      owners={owners}
      initialValues={{
        name: building.name,
        street: building.street,
        area: building.area,
        ownerId: building.ownerId ?? "",
      }}
    />
  );
};

export default EditBuildingRoute;
