import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { firstQueryError, screenLoadState } from "shared";

import {
  NotPermittedGate,
  QueryPageStatus,
  TenantRepairTimelineScreen,
} from "@/components";
import { useRetryKey } from "@/hooks";

const TenantRepairTimelineRoute = () => {
  const { retryKey, onRetry } = useRetryKey();
  return <TenantRepairTimelineRouteBody key={retryKey} onRetry={onRetry} />;
};

const TenantRepairTimelineRouteBody = ({
  onRetry,
}: {
  onRetry: () => void;
}) => {
  const { workOrderId } = useLocalSearchParams<{ workOrderId: string }>();
  const ticket = useQuery(
    api.workOrders.get,
    workOrderId === undefined
      ? "skip"
      : { workOrderId: workOrderId as Id<"workOrders"> }
  );
  const queries = workOrderId === undefined ? [] : [ticket];

  useEffect(() => {
    if (ticket.isSuccess && ticket.data === null) {
      router.back();
    }
  }, [ticket.data, ticket.isSuccess]);

  return (
    <NotPermittedGate error={firstQueryError(queries)}>
      <QueryPageStatus
        loadState={
          workOrderId === undefined ? "loading" : screenLoadState(queries)
        }
        onRetry={onRetry}
        failedTitle="Couldn't load this repair."
      >
        {ticket.data ? (
          <TenantRepairTimelineScreen
            title={ticket.data.title}
            status={ticket.data.status}
            assigneeName={ticket.data.assigneeName}
            scheduledFor={ticket.data.scheduledFor}
            reportedAt={ticket.data.reportedAt}
            photoUrls={ticket.data.photoUrls}
            completionPhotoUrls={ticket.data.completionPhotoUrls}
            events={ticket.data.events}
            onBack={() => {
              router.back();
            }}
          />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default TenantRepairTimelineRoute;
