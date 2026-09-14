import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

import { LoadingScreen, TenantRentScreen } from "@/components";
import { useFieldSession } from "@/hooks";
import { getConvexErrorMessage, showErrorToast } from "@/utils";

const TenantRentRoute = () => {
  const { isViewerReady, currentLease } = useFieldSession();
  const rent = useQuery(
    api.rent.listForCurrentTenant,
    isViewerReady && currentLease !== null ? {} : "skip"
  );
  const reportPayment = useMutation(api.rent.reportPaymentByTenant);
  const [reportingPeriodId, setReportingPeriodId] = useState<string | null>(
    null
  );

  if (rent === undefined) {
    return <LoadingScreen />;
  }

  return (
    <TenantRentScreen
      periods={rent.periods}
      serverNow={rent.serverNow}
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
  );
};

export default TenantRentRoute;
