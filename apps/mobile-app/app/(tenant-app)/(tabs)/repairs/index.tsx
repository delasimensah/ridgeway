import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { type Href, router } from "expo-router";
import { firstQueryError, screenLoadState } from "shared";

import {
  NotPermittedGate,
  QueryPageStatus,
  TenantRepairsScreen,
} from "@/components";
import { useFieldSession, useRetryKey } from "@/hooks";

const TenantRepairsRoute = () => {
  const { retryKey, onRetry } = useRetryKey();
  return <TenantRepairsRouteBody key={retryKey} onRetry={onRetry} />;
};

const TenantRepairsRouteBody = ({ onRetry }: { onRetry: () => void }) => {
  const { isViewerReady, currentLease } = useFieldSession();
  const repairs = useQuery(
    api.workOrders.listForCurrentTenant,
    isViewerReady && currentLease !== null ? {} : "skip"
  );
  const queries = isViewerReady && currentLease !== null ? [repairs] : [];

  return (
    <NotPermittedGate error={firstQueryError(queries)}>
      <QueryPageStatus
        loadState={queries.length === 0 ? "loading" : screenLoadState(queries)}
        onRetry={onRetry}
        failedTitle="Couldn't load repairs."
      >
        <TenantRepairsScreen
          repairs={repairs.data ?? []}
          onFileRepair={() => {
            router.push("/(tenant-app)/file-repair" as Href);
          }}
          onOpenRepair={(workOrderId) => {
            router.push(`/(tenant-app)/repair/${workOrderId}` as Href);
          }}
        />
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default TenantRepairsRoute;
