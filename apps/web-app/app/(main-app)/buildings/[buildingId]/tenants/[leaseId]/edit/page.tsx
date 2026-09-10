"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AddTenantPage, LoadingScreen } from "@/components";

const EditTenantRoute = () => {
  const params = useParams<{ buildingId: string; leaseId: string }>();
  const router = useRouter();
  const buildingId = params.buildingId as Id<"buildings">;
  const leaseId = params.leaseId as Id<"leases">;
  const building = useQuery(api.buildings.get, { buildingId });
  const lease = useQuery(api.leases.get, { leaseId });
  const units = useQuery(
    api.units.listByBuilding,
    building ? { buildingId } : "skip"
  );

  useEffect(() => {
    if (building === null) {
      router.replace("/buildings");
      return;
    }
    if (
      lease === null ||
      (lease !== undefined && lease.buildingId !== buildingId)
    ) {
      router.replace(`/buildings/${buildingId}`);
    }
  }, [building, buildingId, lease, router]);

  if (
    building === undefined ||
    building === null ||
    lease === undefined ||
    lease === null ||
    units === undefined ||
    lease.buildingId !== buildingId
  ) {
    return <LoadingScreen fillViewport={false} />;
  }

  const unit = units.find((row) => row._id === lease.unitId);

  return (
    <AddTenantPage
      buildingId={building._id}
      buildingName={building.name}
      units={[{ _id: lease.unitId, label: unit?.label ?? "" }]}
      unitLabel={unit?.label}
      leaseId={lease._id}
      lockUnit
      hasLogin={lease.hasLogin}
      initialValues={{
        unitId: lease.unitId,
        displayName: lease.displayName,
        phone: lease.phone ?? "",
        email: lease.email,
        startedOn: lease.startedOn,
        endedOn: lease.endedOn ?? "",
        password: "",
      }}
    />
  );
};

export default EditTenantRoute;
