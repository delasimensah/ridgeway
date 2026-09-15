import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { type Href, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { firstQueryError, screenLoadState } from "shared";

import { JobDetailScreen, NotPermittedGate } from "@/components";
import { useRetryKey } from "@/hooks";

const JobDetailRoute = () => {
  const { retryKey, onRetry } = useRetryKey();
  return <JobDetailRouteBody key={retryKey} onRetry={onRetry} />;
};

const JobDetailRouteBody = ({ onRetry }: { onRetry: () => void }) => {
  const { workOrderId } = useLocalSearchParams<{ workOrderId: string }>();
  const ticket = useQuery(api.workOrders.get, {
    workOrderId: workOrderId as Id<"workOrders">,
  });
  const loadState = screenLoadState([ticket]);

  useEffect(() => {
    if (ticket.isSuccess && ticket.data === null) {
      router.back();
    }
  }, [ticket.data, ticket.isSuccess]);

  const canUpdateStatus =
    ticket.data != null &&
    (ticket.data.allowedNextStatuses.length > 0 ||
      ticket.data.canSchedule ||
      ticket.data.canComplete);

  return (
    <NotPermittedGate error={firstQueryError([ticket])}>
      <JobDetailScreen
        isLoading={
          loadState === "loading" || (ticket.isSuccess && ticket.data === null)
        }
        loadError={loadState === "failed"}
        onRetry={onRetry}
        title={ticket.data?.title ?? ""}
        buildingName={ticket.data?.buildingName ?? ""}
        unitLabel={ticket.data?.unitLabel ?? ""}
        address={ticket.data?.address ?? ""}
        status={ticket.data?.status ?? "assigned"}
        description={ticket.data?.description ?? ""}
        canUpdateStatus={canUpdateStatus}
        onBack={() => {
          router.back();
        }}
        onUpdateStatus={() => {
          router.push(`/(main-app)/job/${workOrderId}/update-status` as Href);
        }}
      />
    </NotPermittedGate>
  );
};

export default JobDetailRoute;
