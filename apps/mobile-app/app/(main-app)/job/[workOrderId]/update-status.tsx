import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { type Href, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import type { WorkOrderStatus } from "shared";

import { LoadingScreen, UpdateStatusScreen } from "@/components";
import { getConvexErrorMessage, showErrorToast } from "@/utils";

const UpdateStatusRoute = () => {
  const { workOrderId } = useLocalSearchParams<{ workOrderId: string }>();
  const ticket = useQuery(api.workOrders.get, {
    workOrderId: workOrderId as Id<"workOrders">,
  });
  const schedule = useMutation(api.workOrders.schedule);
  const [selected, setSelected] = useState<WorkOrderStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (ticket === undefined || ticket === null) {
    return <LoadingScreen />;
  }

  const options: WorkOrderStatus[] = [
    ticket.status,
    ...ticket.allowedNextStatuses.filter((status) => status !== ticket.status),
  ];
  const chosen = selected ?? ticket.status;

  const handleSave = async () => {
    if (chosen === ticket.status) {
      router.back();
      return;
    }
    if (chosen === "done") {
      router.push(`/(main-app)/job/${workOrderId}/completion-photo` as Href);
      return;
    }
    if (chosen === "scheduled") {
      setIsSaving(true);
      try {
        await schedule({
          workOrderId: workOrderId as Id<"workOrders">,
        });
        router.back();
      } catch (caught) {
        showErrorToast(getConvexErrorMessage(caught));
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <UpdateStatusScreen
      currentStatus={ticket.status}
      options={options}
      selected={chosen}
      isSaving={isSaving}
      onSelect={setSelected}
      onSave={() => {
        void handleSave();
      }}
      onClose={() => {
        router.back();
      }}
    />
  );
};

export default UpdateStatusRoute;
