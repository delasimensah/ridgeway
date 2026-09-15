"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { firstQueryError, screenLoadState } from "shared";

import { NotPermittedGate, StaffFieldPage } from "@/components";
import { reloadWindow } from "@/utils";

const FieldRoute = () => {
  const people = useQuery(api.field.listForStaff, {});

  return (
    <NotPermittedGate error={firstQueryError([people])}>
      <StaffFieldPage
        people={people.data ?? []}
        loadState={screenLoadState([people])}
        onRetry={reloadWindow}
      />
    </NotPermittedGate>
  );
};

export default FieldRoute;
