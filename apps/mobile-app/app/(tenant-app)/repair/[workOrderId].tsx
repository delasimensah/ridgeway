import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";

import { LoadingScreen, TenantRepairTimelineScreen } from "@/components";

const TenantRepairTimelineRoute = () => {
  const { workOrderId } = useLocalSearchParams<{ workOrderId: string }>();
  const ticket = useQuery(
    api.workOrders.get,
    workOrderId === undefined
      ? "skip"
      : { workOrderId: workOrderId as Id<"workOrders"> }
  );

  if (workOrderId === undefined || ticket === undefined) {
    return <LoadingScreen />;
  }

  if (ticket === null) {
    return <LoadingScreen />;
  }

  return (
    <TenantRepairTimelineScreen
      title={ticket.title}
      status={ticket.status}
      assigneeName={ticket.assigneeName}
      scheduledFor={ticket.scheduledFor}
      reportedAt={ticket.reportedAt}
      photoUrls={ticket.photoUrls}
      completionPhotoUrls={ticket.completionPhotoUrls}
      events={ticket.events}
      onBack={() => {
        router.back();
      }}
    />
  );
};

export default TenantRepairTimelineRoute;
