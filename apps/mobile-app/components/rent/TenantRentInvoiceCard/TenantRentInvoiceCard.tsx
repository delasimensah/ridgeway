import React from "react";
import {
  type Currency,
  formatDateString,
  formatMoney,
  formatPeriodLabel,
  getRentDisplayStatus,
  type RentConfirmedStatus,
} from "shared";

import Button from "../../ui/Button/Button";
import { HStack, VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";
import RentStatusChip from "../RentStatusChip/RentStatusChip";

interface TenantRentInvoiceCardProps {
  periodLabel: string;
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
  tenantReportedAt: number | null;
  serverNow: number;
  isReporting?: boolean;
  onReport: () => void;
}

const TenantRentInvoiceCard: React.FC<TenantRentInvoiceCardProps> = ({
  periodLabel,
  amount,
  currency,
  dueOn,
  confirmedStatus,
  tenantReportedAt,
  serverNow,
  isReporting = false,
  onReport,
}) => {
  const status = getRentDisplayStatus({ confirmedStatus, dueOn }, serverNow);
  const canReport = confirmedStatus !== "paid" && tenantReportedAt === null;

  return (
    <VStack
      spacing="md"
      className="rounded-lg border border-border bg-white p-5"
    >
      <HStack align="start" justify="between">
        <VStack spacing="none">
          <Text className="font-app-bold text-lg text-darkGrey">
            {formatPeriodLabel(periodLabel)}
          </Text>
          <Text className="text-sm text-grey">
            Due {formatDateString(dueOn, "d MMM yyyy")}
          </Text>
        </VStack>
        <RentStatusChip status={status} />
      </HStack>
      <HStack
        align="center"
        justify="between"
        className="border-y border-border py-4"
      >
        <Text className="text-base text-grey">Total Amount</Text>
        <Text className="font-app-bold text-xl text-darkGrey">
          {formatMoney(amount, currency)}
        </Text>
      </HStack>
      {canReport ? (
        <VStack spacing="sm">
          <Button
            text="I have paid"
            size="lg"
            fullWidth
            loading={isReporting}
            onPress={onReport}
          />
          <Text className="text-center text-[13px] italic text-grey">
            Note: Ridgeway staff still confirm all payments manually.
          </Text>
        </VStack>
      ) : tenantReportedAt !== null && confirmedStatus !== "paid" ? (
        <Text className="text-center font-app-medium text-sm text-grey">
          Reported. Ridgeway staff still confirm this.
        </Text>
      ) : null}
    </VStack>
  );
};

export default TenantRentInvoiceCard;
