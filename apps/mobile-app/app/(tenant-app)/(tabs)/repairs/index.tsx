import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { type Href, router } from "expo-router";

import { LoadingScreen, TenantRepairsScreen } from "@/components";
import { useFieldSession } from "@/hooks";

const TenantRepairsRoute = () => {
  const { isViewerReady, currentLease } = useFieldSession();
  const repairs = useQuery(
    api.workOrders.listForCurrentTenant,
    isViewerReady && currentLease !== null ? {} : "skip"
  );

  if (repairs === undefined) {
    return <LoadingScreen />;
  }

  return (
    <TenantRepairsScreen
      repairs={repairs}
      onFileRepair={() => {
        router.push("/(tenant-app)/file-repair" as Href);
      }}
      onOpenRepair={(workOrderId) => {
        router.push(`/(tenant-app)/repair/${workOrderId}` as Href);
      }}
    />
  );
};

export default TenantRepairsRoute;
