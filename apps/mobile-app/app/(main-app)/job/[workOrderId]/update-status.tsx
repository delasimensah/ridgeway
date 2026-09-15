import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react";
import { type Href, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { firstQueryError, screenLoadState, type WorkOrderStatus } from "shared";

import {
  NotPermittedGate,
  QueryPageStatus,
  UpdateStatusScreen,
} from "@/components";
import { useRetryKey } from "@/hooks";
import { getConvexErrorMessage, showErrorToast } from "@/utils";

const UpdateStatusRoute = () => {
  const { retryKey, onRetry } = useRetryKey();
  return <UpdateStatusRouteBody key={retryKey} onRetry={onRetry} />;
};

const UpdateStatusRouteBody = ({ onRetry }: { onRetry: () => void }) => {
  const { workOrderId } = useLocalSearchParams<{ workOrderId: string }>();
  const ticket = useQuery(api.workOrders.get, {
    workOrderId: workOrderId as Id<"workOrders">,
  });
  const schedule = useMutation(api.workOrders.schedule);
  const [selected, setSelected] = useState<WorkOrderStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (ticket.isSuccess && ticket.data === null) {
      router.back();
    }
  }, [ticket.data, ticket.isSuccess]);

  const row = ticket.data;
  const options: WorkOrderStatus[] = row
    ? [
        row.status,
        ...row.allowedNextStatuses.filter((status) => status !== row.status),
      ]
    : [];
  const chosen = selected ?? row?.status ?? "assigned";

  const handleSave = async () => {
    const current = ticket.data;
    if (current === undefined || current === null) {
      return;
    }
    if (chosen === current.status) {
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
    <NotPermittedGate error={firstQueryError([ticket])}>
      <QueryPageStatus
        loadState={screenLoadState([ticket])}
        onRetry={onRetry}
        failedTitle="Couldn't load this job."
      >
        {ticket.data ? (
          <UpdateStatusScreen
            currentStatus={ticket.data.status}
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
        ) : null}
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default UpdateStatusRoute;
