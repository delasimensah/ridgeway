"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { firstQueryError, screenLoadState } from "shared";

import {
  AddOfficePersonPage,
  NotPermittedGate,
  QueryPageStatus,
} from "@/components";
import { reloadWindow } from "@/utils";

const EditOfficePersonRoute = () => {
  const params = useParams<{ profileId: string }>();
  const router = useRouter();
  const profileId = params.profileId as Id<"profiles">;
  const person = useQuery(api.staff.get, { profileId });

  useEffect(() => {
    if (person.isSuccess && person.data === null) {
      router.replace("/office");
    }
  }, [person.data, person.isSuccess, router]);

  return (
    <NotPermittedGate error={firstQueryError([person])}>
      <QueryPageStatus
        loadState={screenLoadState([person])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this person."
      >
        {person.data ? (
          <AddOfficePersonPage
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

export default EditOfficePersonRoute;
