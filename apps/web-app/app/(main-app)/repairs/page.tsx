"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { firstQueryError, screenLoadState } from "shared";

import {
  NotPermittedGate,
  OwnerIssuesPage,
  QueryPageStatus,
  StaffRepairsPage,
} from "@/components";
import { useStaffSession } from "@/hooks";
import { reloadWindow } from "@/utils";

const StaffRepairsRoute = () => {
  const session = useStaffSession();
  const router = useRouter();
  const staffRepairs = useQuery(
    api.workOrders.listForStaff,
    session.isStaff ? {} : "skip"
  );
  const ownerIssues = useQuery(
    api.workOrders.listForOwner,
    session.isOwner ? {} : "skip"
  );

  useEffect(() => {
    if (session.isTenant) {
      router.replace("/");
    }
  }, [router, session.isTenant]);

  if (session.isTenant) {
    return null;
  }

  if (session.isOwner) {
    return (
      <NotPermittedGate error={firstQueryError([ownerIssues])}>
        <QueryPageStatus
          loadState={screenLoadState([ownerIssues])}
          onRetry={reloadWindow}
          failedTitle="Couldn't load issues."
        >
          <OwnerIssuesPage issues={ownerIssues.data ?? []} />
        </QueryPageStatus>
      </NotPermittedGate>
    );
  }

  return (
    <NotPermittedGate error={firstQueryError([staffRepairs])}>
      <StaffRepairsPage
        repairs={staffRepairs.data ?? []}
        loadState={screenLoadState([staffRepairs])}
        onRetry={reloadWindow}
      />
    </NotPermittedGate>
  );
};

export default StaffRepairsRoute;
