"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { LoadingScreen, StaffBuildingsPage } from "@/components";

const BuildingsRoute = () => {
  const buildings = useQuery(api.buildings.listForViewer, {});

  if (buildings === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  return <StaffBuildingsPage buildings={buildings} />;
};

export default BuildingsRoute;
