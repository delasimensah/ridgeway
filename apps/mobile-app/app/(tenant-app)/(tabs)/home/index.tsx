import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { type Href, router } from "expo-router";

import { LoadingScreen, TenantHomeScreen } from "@/components";
import { useFieldSession } from "@/hooks";

const TenantHomeRoute = () => {
  const { isViewerReady, currentLease } = useFieldSession();
  const rent = useQuery(
    api.rent.listForCurrentTenant,
    isViewerReady && currentLease !== null ? {} : "skip"
  );
  const repairs = useQuery(
    api.workOrders.listForCurrentTenant,
    isViewerReady && currentLease !== null ? {} : "skip"
  );

  if (currentLease === null || rent === undefined || repairs === undefined) {
    return <LoadingScreen />;
  }

  const nextRent =
    rent.periods.find((period) => period.confirmedStatus !== "paid") ?? null;

  return (
    <TenantHomeScreen
      unitLabel={currentLease.unitLabel}
      buildingName={currentLease.buildingName}
      address={currentLease.address}
      nextRent={nextRent}
      serverNow={rent.serverNow}
      repairs={repairs}
      onManageRent={() => {
        router.push("/(tenant-app)/(tabs)/rent" as Href);
      }}
    />
  );
};

export default TenantHomeRoute;
