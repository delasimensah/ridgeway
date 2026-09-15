"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { firstQueryError, screenLoadState } from "shared";

import { NotPermittedGate, StaffTenantsPage } from "@/components";
import { reloadWindow } from "@/utils";

const TenantsRoute = () => {
  const tenants = useQuery(api.leases.listForStaff, {});

  return (
    <NotPermittedGate error={firstQueryError([tenants])}>
      <StaffTenantsPage
        tenants={tenants.data ?? []}
        loadState={screenLoadState([tenants])}
        onRetry={reloadWindow}
      />
    </NotPermittedGate>
  );
};

export default TenantsRoute;
