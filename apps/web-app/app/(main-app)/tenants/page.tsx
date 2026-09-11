"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { LoadingScreen, StaffTenantsPage } from "@/components";

const TenantsRoute = () => {
  const tenants = useQuery(api.leases.listForStaff, {});

  if (tenants === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  return <StaffTenantsPage tenants={tenants} />;
};

export default TenantsRoute;
