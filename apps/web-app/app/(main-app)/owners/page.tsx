"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { firstQueryError, screenLoadState } from "shared";

import { NotPermittedGate, StaffOwnersPage } from "@/components";
import { reloadWindow } from "@/utils";

const OwnersRoute = () => {
  const owners = useQuery(api.owners.listForStaff, {});

  return (
    <NotPermittedGate error={firstQueryError([owners])}>
      <StaffOwnersPage
        owners={owners.data ?? []}
        loadState={screenLoadState([owners])}
        onRetry={reloadWindow}
      />
    </NotPermittedGate>
  );
};

export default OwnersRoute;
