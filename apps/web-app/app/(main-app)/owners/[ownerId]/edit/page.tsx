"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { firstQueryError, screenLoadState } from "shared";

import { AddOwnerPage, NotPermittedGate, QueryPageStatus } from "@/components";
import { reloadWindow } from "@/utils";

const EditOwnerRoute = () => {
  const params = useParams<{ ownerId: string }>();
  const router = useRouter();
  const ownerId = params.ownerId as Id<"owners">;
  const owner = useQuery(api.owners.get, { ownerId });

  useEffect(() => {
    if (owner.isSuccess && owner.data === null) {
      router.replace("/owners");
    }
  }, [owner.data, owner.isSuccess, router]);

  return (
    <NotPermittedGate error={firstQueryError([owner])}>
      <QueryPageStatus
        loadState={screenLoadState([owner])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this owner."
      >
        {owner.data ? (
          <AddOwnerPage
            ownerId={owner.data._id}
            hasLogin={owner.data.hasLogin}
            initialValues={{
              displayName: owner.data.displayName,
              contactEmail: owner.data.contactEmail ?? "",
              contactPhone: owner.data.contactPhone ?? "",
              password: "",
            }}
          />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default EditOwnerRoute;
