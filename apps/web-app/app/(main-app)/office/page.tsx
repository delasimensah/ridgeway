"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { LoadingScreen, StaffOfficePage } from "@/components";

const OfficeRoute = () => {
  const people = useQuery(api.staff.listForStaff, {});

  if (people === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  return <StaffOfficePage people={people} />;
};

export default OfficeRoute;
