import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type Currency, type RentConfirmedStatus } from "shared";

import TenantRentHistoryCard from "../../../rent/TenantRentHistoryCard/TenantRentHistoryCard";
import TenantRentInvoiceCard from "../../../rent/TenantRentInvoiceCard/TenantRentInvoiceCard";
import ListEmpty from "../../../ui/ListEmpty/ListEmpty";
import ScrollableStack from "../../../ui/ScrollableStack/ScrollableStack";
import { VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

export interface TenantRentPeriod {
  _id: string;
  periodLabel: string;
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
  confirmedAmount: number | null;
  tenantReportedAt: number | null;
}

interface TenantRentScreenProps {
  periods: TenantRentPeriod[];
  serverNow: number;
  reportingPeriodId?: string | null;
  onReport: (rentPeriodId: string) => void;
}

const TenantRentScreen: React.FC<TenantRentScreenProps> = ({
  periods,
  serverNow,
  reportingPeriodId = null,
  onReport,
}) => {
  const insets = useSafeAreaInsets();
  const open = periods.filter((period) => period.confirmedStatus !== "paid");
  const history = periods.filter((period) => period.confirmedStatus === "paid");

  return (
    <VStack
      spacing="none"
      className="flex-1 bg-sidebar"
      style={{ paddingTop: insets.top + 8 }}
    >
      <VStack spacing="none" paddingX="md" className="pb-2 pt-3">
        <Text className="font-app-bold text-3xl text-darkGrey">Rent</Text>
        <Text className="text-sm text-grey">
          Report when you have paid. Staff still confirm.
        </Text>
      </VStack>
      <ScrollableStack paddingX="md" paddingY="sm" className="flex-1">
        <VStack spacing="lg" className="pb-8">
          {open.length === 0 ? (
            <ListEmpty message="No open rent." className="py-6" />
          ) : (
            open.map((period) => (
              <TenantRentInvoiceCard
                key={period._id}
                periodLabel={period.periodLabel}
                amount={period.amount}
                currency={period.currency}
                dueOn={period.dueOn}
                confirmedStatus={period.confirmedStatus}
                confirmedAmount={period.confirmedAmount}
                tenantReportedAt={period.tenantReportedAt}
                serverNow={serverNow}
                isReporting={reportingPeriodId === period._id}
                onReport={() => onReport(period._id)}
              />
            ))
          )}
          {history.length > 0 ? (
            <VStack spacing="sm">
              <Text className="font-app-bold text-sm uppercase tracking-wider text-darkGrey">
                Payment History
              </Text>
              {history.map((period) => (
                <TenantRentHistoryCard
                  key={period._id}
                  periodLabel={period.periodLabel}
                  amount={period.amount}
                  currency={period.currency}
                />
              ))}
            </VStack>
          ) : null}
        </VStack>
      </ScrollableStack>
    </VStack>
  );
};

export default TenantRentScreen;
