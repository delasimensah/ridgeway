"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AddOfficePersonPage, LoadingScreen } from "@/components";

const EditOfficePersonRoute = () => {
  const params = useParams<{ profileId: string }>();
  const router = useRouter();
  const profileId = params.profileId as Id<"profiles">;
  const person = useQuery(api.staff.get, { profileId });

  useEffect(() => {
    if (person === null) {
      router.replace("/office");
    }
  }, [person, router]);

  if (person === undefined || person === null) {
    return <LoadingScreen fillViewport={false} />;
  }

  return (
    <AddOfficePersonPage
      profileId={person._id}
      initialValues={{
        displayName: person.displayName,
        email: person.email ?? "",
        password: "",
      }}
    />
  );
};

export default EditOfficePersonRoute;
