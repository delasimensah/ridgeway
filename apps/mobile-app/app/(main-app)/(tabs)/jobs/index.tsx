import { api } from "@convex/_generated/api";
import { useConvex, useQuery } from "convex/react";
import { type Href, router } from "expo-router";
import { useState } from "react";

import { JobsScreen } from "@/components";
import { useFieldSession } from "@/hooks";
import { formatJobsHeadingDate } from "@/utils";

const JobsRoute = () => {
  const convex = useConvex();
  const { isViewerReady, isField } = useFieldSession();
  const jobs = useQuery(
    api.workOrders.listForCurrentField,
    isViewerReady && isField ? {} : "skip"
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await convex.query(api.workOrders.listForCurrentField, {});
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <JobsScreen
      headingDate={formatJobsHeadingDate()}
      jobs={jobs ?? []}
      isLoading={jobs === undefined}
      refreshing={refreshing}
      onRefresh={() => {
        void handleRefresh();
      }}
      onOpenJob={(jobId) => {
        router.push(`/(main-app)/job/${jobId}` as Href);
      }}
    />
  );
};

export default JobsRoute;
