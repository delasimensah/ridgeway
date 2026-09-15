"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { firstQueryError, screenLoadState } from "shared";

import {
  AddFieldWorkerPage,
  NotPermittedGate,
  QueryPageStatus,
} from "@/components";
import { reloadWindow } from "@/utils";

const EditFieldWorkerRoute = () => {
  const params = useParams<{ profileId: string }>();
  const router = useRouter();
  const profileId = params.profileId as Id<"profiles">;
  const person = useQuery(api.field.get, { profileId });

  useEffect(() => {
    if (person.isSuccess && person.data === null) {
      router.replace("/field");
    }
  }, [person.data, person.isSuccess, router]);

  return (
    <NotPermittedGate error={firstQueryError([person])}>
      <QueryPageStatus
        loadState={screenLoadState([person])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this field worker."
      >
        {person.data ? (
          <AddFieldWorkerPage
            profileId={person.data._id}
            initialValues={{
              displayName: person.data.displayName,
              email: person.data.email ?? "",
              password: "",
            }}
          />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default EditFieldWorkerRoute;
