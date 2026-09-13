import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { type Href, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

import { JobDetailScreen } from "@/components";

const JobDetailRoute = () => {
  const { workOrderId } = useLocalSearchParams<{ workOrderId: string }>();
  const ticket = useQuery(api.workOrders.get, {
    workOrderId: workOrderId as Id<"workOrders">,
  });

  useEffect(() => {
    if (ticket === null) {
      router.back();
    }
  }, [ticket]);

  const canUpdateStatus =
    ticket != null &&
    (ticket.allowedNextStatuses.length > 0 ||
      ticket.canSchedule ||
      ticket.canComplete);

  return (
    <JobDetailScreen
      isLoading={ticket === undefined || ticket === null}
      title={ticket?.title ?? ""}
      buildingName={ticket?.buildingName ?? ""}
      unitLabel={ticket?.unitLabel ?? ""}
      address={ticket?.address ?? ""}
      status={ticket?.status ?? "assigned"}
      description={ticket?.description ?? ""}
      canUpdateStatus={canUpdateStatus}
      onBack={() => {
        router.back();
      }}
      onUpdateStatus={() => {
        router.push(`/(main-app)/job/${workOrderId}/update-status` as Href);
      }}
    />
  );
};

export default JobDetailRoute;
