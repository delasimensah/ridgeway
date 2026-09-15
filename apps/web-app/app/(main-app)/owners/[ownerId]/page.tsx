"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { useParams } from "next/navigation";
import { firstQueryError, screenLoadState } from "shared";

import {
  NotPermittedGate,
  QueryPageStatus,
  StaffOwnerPage,
} from "@/components";
import { reloadWindow } from "@/utils";

const OwnerRoute = () => {
  const params = useParams<{ ownerId: string }>();
  const ownerId = params.ownerId as Id<"owners">;
  const owner = useQuery(api.owners.get, { ownerId });

  return (
    <NotPermittedGate error={firstQueryError([owner])}>
      <QueryPageStatus
        loadState={screenLoadState([owner])}
        onRetry={reloadWindow}
        failedTitle="Couldn't load this owner."
      >
        {owner.data ? (
          <StaffOwnerPage
            ownerId={owner.data._id}
            displayName={owner.data.displayName}
            contactEmail={owner.data.contactEmail}
            hasLogin={owner.data.hasLogin}
            buildings={owner.data.buildings}
          />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default OwnerRoute;
