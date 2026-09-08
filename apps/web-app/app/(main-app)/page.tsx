"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { LoadingScreen, StaffHomePage } from "@/components";
import { staffGreeting } from "@/utils";

const HomeRoute = () => {
  const home = useQuery(api.staff.getHome, {});

  if (home === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  return <StaffHomePage greeting={staffGreeting(home.displayName)} />;
};

export default HomeRoute;
