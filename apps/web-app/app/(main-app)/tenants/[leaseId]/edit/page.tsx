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
  const params = useParams<{ leaseId: string }>();
  const router = useRouter();
  const leaseId = params.leaseId as Id<"leases">;
  const lease = useQuery(api.leases.get, { leaseId });
  const building = useQuery(
    api.buildings.get,
    lease.data ? { buildingId: lease.data.buildingId } : "skip"
  );
  const units = useQuery(
    api.units.listByBuilding,
    lease.data ? { buildingId: lease.data.buildingId } : "skip"
  );

  useEffect(() => {
    if (lease.isSuccess && lease.data === null) {
      router.replace("/tenants");
    }
  }, [lease.data, lease.isSuccess, router]);

  const unit = (units.data ?? []).find((row) => row._id === lease.data?.unitId);

  return (
    <NotPermittedGate error={firstQueryError([lease, building, units])}>
      <QueryPageStatus
        loadState={screenLoadState([lease, building, units])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this tenant."
      >
        {lease.data && building.data ? (
          <AddTenantPage
            buildingId={building.data._id}
            buildingName={building.data.name}
            units={[{ _id: lease.data.unitId, label: unit?.label ?? "" }]}
            unitLabel={unit?.label}
            leaseId={lease.data._id}
            lockUnit
            hasLogin={lease.data.hasLogin}
            returnHref="/tenants"
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
