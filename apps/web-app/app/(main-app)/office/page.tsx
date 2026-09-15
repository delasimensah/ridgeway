"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { firstQueryError, screenLoadState } from "shared";

import { NotPermittedGate, StaffOfficePage } from "@/components";
import { reloadWindow } from "@/utils";

const OfficeRoute = () => {
  const people = useQuery(api.staff.listForStaff, {});

  return (
    <NotPermittedGate error={firstQueryError([people])}>
      <StaffOfficePage
        people={people.data ?? []}
        loadState={screenLoadState([people])}
        onRetry={reloadWindow}
      />
    </NotPermittedGate>
  );
};

export default OfficeRoute;
