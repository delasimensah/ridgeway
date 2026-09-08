"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AddOwnerPage, LoadingScreen } from "@/components";

const EditOwnerRoute = () => {
  const params = useParams<{ ownerId: string }>();
  const router = useRouter();
  const ownerId = params.ownerId as Id<"owners">;
  const owner = useQuery(api.owners.get, { ownerId });

  useEffect(() => {
    if (owner === null) {
      router.replace("/buildings");
    }
  }, [owner, router]);

  if (owner === undefined || owner === null) {
    return <LoadingScreen fillViewport={false} />;
  }

  return (
    <AddOwnerPage
      ownerId={owner._id}
      initialValues={{
        displayName: owner.displayName,
        contactEmail: owner.contactEmail ?? "",
        contactPhone: owner.contactPhone ?? "",
      }}
    />
  );
};

export default EditOwnerRoute;
