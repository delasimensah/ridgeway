import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

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

  return <TenantRepairsScreen repairs={repairs} />;
};

export default TenantRepairsRoute;
