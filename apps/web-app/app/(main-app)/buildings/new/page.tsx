"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { AddBuildingPage, LoadingScreen } from "@/components";

const AddBuildingRoute = () => {
  const owners = useQuery(api.owners.listForStaff);

  if (owners === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  return <AddBuildingPage owners={owners} />;
};

export default AddBuildingRoute;
