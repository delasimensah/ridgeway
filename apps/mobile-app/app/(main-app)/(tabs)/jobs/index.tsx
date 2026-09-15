import { api } from "@convex/_generated/api";
import { useConvex } from "convex/react";
import { useQuery } from "convex-helpers/react";
import { type Href, router } from "expo-router";
import { useState } from "react";
import { firstQueryError, screenLoadState } from "shared";

import { JobsScreen, NotPermittedGate } from "@/components";
import { useFieldSession, useRetryKey } from "@/hooks";
import { formatJobsHeadingDate } from "@/utils";

const JobsRoute = () => {
  const { retryKey, onRetry } = useRetryKey();
  return <JobsRouteBody key={retryKey} onRetry={onRetry} />;
};

const JobsRouteBody = ({ onRetry }: { onRetry: () => void }) => {
  const convex = useConvex();
  const { isViewerReady } = useFieldSession();
  const jobs = useQuery(
    api.workOrders.listForCurrentField,
    isViewerReady ? {} : "skip"
  );
  const [refreshing, setRefreshing] = useState(false);
  const loadState = screenLoadState([jobs]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await convex.query(api.workOrders.listForCurrentField, {});
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <NotPermittedGate error={firstQueryError([jobs])}>
      <JobsScreen
        headingDate={formatJobsHeadingDate()}
        jobs={jobs.data ?? []}
        isLoading={loadState === "loading"}
        loadError={loadState === "failed"}
        onRetry={onRetry}
        refreshing={refreshing}
        onRefresh={() => {
          void handleRefresh();
        }}
        onOpenJob={(jobId) => {
          router.push(`/(main-app)/job/${jobId}` as Href);
        }}
      />
    </NotPermittedGate>
  );
};

export default JobsRoute;
