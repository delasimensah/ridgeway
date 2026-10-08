"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { firstQueryError, screenLoadState } from "shared";

import {
  NotPermittedGate,
  QueryPageStatus,
  StaffFieldWorkerPage,
} from "@/components";
import { reloadWindow } from "@/utils";

const FieldWorkerRoute = () => {
  const params = useParams<{ profileId: string }>();
  const router = useRouter();
  const profileId = params.profileId as Id<"profiles">;
  const person = useQuery(api.field.get, { profileId });
  const jobs = useQuery(api.workOrders.listForAssignee, { profileId });

  useEffect(() => {
    if (person.isSuccess && person.data === null) {
      router.replace("/users");
    }
  }, [person.data, person.isSuccess, router]);

  return (
    <NotPermittedGate error={firstQueryError([person, jobs])}>
      <QueryPageStatus
        loadState={screenLoadState([person, jobs])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this field worker."
      >
        {person.data ? (
          <StaffFieldWorkerPage
            profileId={person.data._id}
            displayName={person.data.displayName}
            email={person.data.email}
            hasLogin={person.data.hasLogin}
            jobs={jobs.data ?? []}
          />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default FieldWorkerRoute;
