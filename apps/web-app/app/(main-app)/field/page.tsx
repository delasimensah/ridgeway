"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { LoadingScreen, StaffFieldPage } from "@/components";

const FieldRoute = () => {
  const people = useQuery(api.field.listForStaff, {});

  if (people === undefined) {
    return <LoadingScreen fillViewport={false} />;
  }

  return <StaffFieldPage people={people} />;
};

export default FieldRoute;
