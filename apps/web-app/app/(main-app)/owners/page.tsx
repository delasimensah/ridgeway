"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { LoadingScreen, StaffOwnersPage } from "@/components";

const OwnersRoute = () => {
  const owners = useQuery(api.owners.listForStaff, {});

  if (owners === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  return <StaffOwnersPage owners={owners} />;
};

export default OwnersRoute;
