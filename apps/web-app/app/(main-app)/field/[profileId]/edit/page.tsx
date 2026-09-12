"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AddFieldWorkerPage, LoadingScreen } from "@/components";

const EditFieldWorkerRoute = () => {
  const params = useParams<{ profileId: string }>();
  const router = useRouter();
  const profileId = params.profileId as Id<"profiles">;
  const person = useQuery(api.field.get, { profileId });

  useEffect(() => {
    if (person === null) {
      router.replace("/field");
    }
  }, [person, router]);

  if (person === undefined || person === null) {
    return <LoadingScreen fillViewport={false} />;
  }

  return (
    <AddFieldWorkerPage
      profileId={person._id}
      initialValues={{
        displayName: person.displayName,
        email: person.email ?? "",
        password: "",
      }}
    />
  );
};

export default EditFieldWorkerRoute;
