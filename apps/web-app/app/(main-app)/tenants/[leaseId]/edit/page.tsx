"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AddTenantPage, LoadingScreen } from "@/components";

const EditTenantRoute = () => {
  const params = useParams<{ leaseId: string }>();
  const router = useRouter();
  const leaseId = params.leaseId as Id<"leases">;
  const lease = useQuery(api.leases.get, { leaseId });
  const building = useQuery(
    api.buildings.get,
    lease ? { buildingId: lease.buildingId } : "skip"
  );
  const units = useQuery(
    api.units.listByBuilding,
    lease ? { buildingId: lease.buildingId } : "skip"
  );

  useEffect(() => {
    if (lease === null || building === null) {
      router.replace("/tenants");
    }
  }, [building, lease, router]);

  if (
    lease === undefined ||
    lease === null ||
    building === undefined ||
    building === null ||
    units === undefined
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
      returnHref="/tenants"
      initialValues={{
        unitId: lease.unitId,
        displayName: lease.displayName,
        phone: lease.phone ?? "",
        email: lease.email,
        rentAmount:
          lease.rentAmount === null ? "" : String(lease.rentAmount / 100),
        rentDueDay: lease.rentDueDay === null ? "" : String(lease.rentDueDay),
        startedOn: lease.startedOn,
        endedOn: lease.endedOn ?? "",
        password: "",
      }}
    />
  );
};

export default EditTenantRoute;
