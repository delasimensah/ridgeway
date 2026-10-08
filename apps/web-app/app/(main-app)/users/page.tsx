"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { firstQueryError, screenLoadState } from "shared";

import { NotPermittedGate, StaffUsersPage } from "@/components";
import { reloadWindow } from "@/utils";

const UsersRoute = () => {
  const owners = useQuery(api.owners.listForStaff, {});
  const staff = useQuery(api.staff.listForStaff, {});
  const fieldWorkers = useQuery(api.field.listForStaff, {});

  return (
    <NotPermittedGate error={firstQueryError([owners, staff, fieldWorkers])}>
      <StaffUsersPage
        owners={owners.data ?? []}
        ownersLoadState={screenLoadState([owners])}
        staff={staff.data ?? []}
        staffLoadState={screenLoadState([staff])}
        fieldWorkers={fieldWorkers.data ?? []}
        fieldLoadState={screenLoadState([fieldWorkers])}
        onRetry={reloadWindow}
      />
    </NotPermittedGate>
  );
};

export default UsersRoute;
