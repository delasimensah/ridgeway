"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { firstQueryError, screenLoadState } from "shared";

import { AddTenantPage, NotPermittedGate, QueryPageStatus } from "@/components";
import { reloadWindow } from "@/utils";

const EditTenantRoute = () => {
  const params = useParams<{ buildingId: string; leaseId: string }>();
  const router = useRouter();
  const buildingId = params.buildingId as Id<"buildings">;
  const leaseId = params.leaseId as Id<"leases">;
  const building = useQuery(api.buildings.get, { buildingId });
  const lease = useQuery(api.leases.get, { leaseId });
  const units = useQuery(
    api.units.listByBuilding,
    building.data ? { buildingId } : "skip"
  );

  useEffect(() => {
    if (
      lease.isSuccess &&
      (lease.data === null || lease.data.buildingId !== buildingId)
    ) {
      router.replace(`/buildings/${buildingId}`);
    }
  }, [buildingId, lease.data, lease.isSuccess, router]);

  const unit = (units.data ?? []).find((row) => row._id === lease.data?.unitId);

  return (
    <NotPermittedGate error={firstQueryError([building, lease, units])}>
      <QueryPageStatus
        loadState={screenLoadState([building, lease, units])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this tenant."
      >
        {building.data && lease.data && lease.data.buildingId === buildingId ? (
          <AddTenantPage
            buildingId={building.data._id}
            buildingName={building.data.name}
            units={[{ _id: lease.data.unitId, label: unit?.label ?? "" }]}
            unitLabel={unit?.label}
            leaseId={lease.data._id}
            lockUnit
            hasLogin={lease.data.hasLogin}
            initialValues={{
              unitId: lease.data.unitId,
              displayName: lease.data.displayName,
              phone: lease.data.phone ?? "",
              email: lease.data.email,
              rentAmount:
                lease.data.rentAmount === null
                  ? ""
                  : String(lease.data.rentAmount / 100),
              rentDueDay:
                lease.data.rentDueDay === null
                  ? ""
                  : String(lease.data.rentDueDay),
              startedOn: lease.data.startedOn,
              endedOn: lease.data.endedOn ?? "",
              password: "",
            }}
          />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default EditTenantRoute;
