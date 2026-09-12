"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoadingScreen, StaffOwnerPage } from "@/components";

const OwnerRoute = () => {
  const params = useParams<{ ownerId: string }>();
  const router = useRouter();
  const ownerId = params.ownerId as Id<"owners">;
  const owner = useQuery(api.owners.get, { ownerId });

  useEffect(() => {
    if (owner === null) {
      router.replace("/owners");
    }
  }, [owner, router]);

  if (owner === undefined || owner === null) {
    return <LoadingScreen fillViewport={false} />;
  }

  return (
    <StaffOwnerPage
      ownerId={owner._id}
      displayName={owner.displayName}
      contactEmail={owner.contactEmail}
      hasLogin={owner.hasLogin}
      buildings={owner.buildings}
    />
  );
};

export default OwnerRoute;
