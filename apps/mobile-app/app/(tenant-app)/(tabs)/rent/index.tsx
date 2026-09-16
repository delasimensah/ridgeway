import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react";
import { useState } from "react";
import { firstQueryError, screenLoadState } from "shared";

import {
  NotPermittedGate,
  QueryPageStatus,
  TenantRentScreen,
  TenantRentScreenSkeleton,
} from "@/components";
import { useFieldSession, useRetryKey } from "@/hooks";
import { getConvexErrorMessage, showErrorToast } from "@/utils";

const TenantRentRoute = () => {
  const { retryKey, onRetry } = useRetryKey();
  return <TenantRentRouteBody key={retryKey} onRetry={onRetry} />;
};

const TenantRentRouteBody = ({ onRetry }: { onRetry: () => void }) => {
  const { isViewerReady, currentLease } = useFieldSession();
  const rent = useQuery(
    api.rent.listForCurrentTenant,
    isViewerReady && currentLease !== null ? {} : "skip"
  );
  const reportPayment = useMutation(api.rent.reportPaymentByTenant);
  const [reportingPeriodId, setReportingPeriodId] = useState<string | null>(
    null
  );
  const queries = isViewerReady && currentLease !== null ? [rent] : [];

  return (
    <NotPermittedGate error={firstQueryError(queries)}>
      <QueryPageStatus
        loadState={queries.length === 0 ? "loading" : screenLoadState(queries)}
        onRetry={onRetry}
        failedTitle="Couldn't load rent."
        skeleton={<TenantRentScreenSkeleton />}
      >
        <TenantRentScreen
          periods={rent.data?.periods ?? []}
          serverNow={rent.data?.serverNow ?? 0}
          reportingPeriodId={reportingPeriodId}
          onReport={(rentPeriodId) => {
            setReportingPeriodId(rentPeriodId);
            void reportPayment({
              rentPeriodId: rentPeriodId as Id<"rentPeriods">,
            })
              .catch((error: unknown) => {
                showErrorToast(getConvexErrorMessage(error));
              })
              .finally(() => {
                setReportingPeriodId(null);
              });
          }}
        />
      </QueryPageStatus>
    </NotPermittedGate>
  );
};

export default TenantRentRoute;
