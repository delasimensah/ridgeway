import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { type Href, router } from "expo-router";
import { firstQueryError, screenLoadState } from "shared";

import {
  NotPermittedGate,
  QueryPageStatus,
  TenantHomeScreen,
  TenantHomeScreenSkeleton,
} from "@/components";
import { useFieldSession, useRetryKey } from "@/hooks";

const TenantHomeRoute = () => {
  const { retryKey, onRetry } = useRetryKey();
  return <TenantHomeRouteBody key={retryKey} onRetry={onRetry} />;
};

const TenantHomeRouteBody = ({ onRetry }: { onRetry: () => void }) => {
  const { isViewerReady, currentLease, displayName } = useFieldSession();
  const rent = useQuery(
    api.rent.listForCurrentTenant,
    isViewerReady && currentLease !== null ? {} : "skip"
  );
  const repairs = useQuery(
    api.workOrders.listForCurrentTenant,
    isViewerReady && currentLease !== null ? {} : "skip"
  );
  const queries = isViewerReady && currentLease !== null ? [rent, repairs] : [];
  const nextRent =
    rent.data?.periods.find((period) => period.confirmedStatus !== "paid") ??
    null;

  return (
    <NotPermittedGate error={firstQueryError(queries)}>
      <QueryPageStatus
        loadState={currentLease === null ? "loading" : screenLoadState(queries)}
        onRetry={onRetry}
        failedTitle="Couldn't load home."
        skeleton={<TenantHomeScreenSkeleton />}
      >
        {currentLease !== null ? (
          <TenantHomeScreen
            displayName={displayName}
            unitLabel={currentLease.unitLabel}
            buildingName={currentLease.buildingName}
            address={currentLease.address}
            nextRent={nextRent}
            serverNow={rent.data?.serverNow ?? 0}
            repairs={repairs.data ?? []}
            onManageRent={() => {
              router.push("/(tenant-app)/(tabs)/rent" as Href);
            }}
            onFileRepair={() => {
              router.push("/(tenant-app)/file-repair" as Href);
            }}
            onOpenRepair={(workOrderId) => {
              router.push(`/(tenant-app)/repair/${workOrderId}` as Href);
            }}
          />
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default TenantHomeRoute;
