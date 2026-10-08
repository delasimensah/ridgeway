import React from "react";
import {
  type Currency,
  formatDateString,
  formatMoney,
  formatPeriodLabel,
  formatRentPartialLine,
  getRentDisplayStatus,
  type RentConfirmedStatus,
} from "shared";

import { COLORS } from "@/constants";

import Button from "../../ui/Button/Button";
import { HStack, VStack } from "../../ui/Stack/Stack";
import SurfaceCard from "../../ui/SurfaceCard/SurfaceCard";
import Text from "../../ui/Text/Text";
import RentStatusChip from "../RentStatusChip/RentStatusChip";

interface TenantRentInvoiceCardProps {
  periodLabel: string;
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
  confirmedAmount: number | null;
  tenantReportedAt: number | null;
  serverNow: number;
  isReporting?: boolean;
  onReport: () => void;
}

const RENT_STRIPE: Record<string, string> = {
  paid: COLORS.primary,
  due: COLORS.grey,
  late: COLORS.overdue,
  partial: COLORS.accent,
};

const TenantRentInvoiceCard: React.FC<TenantRentInvoiceCardProps> = ({
  periodLabel,
  amount,
  currency,
  dueOn,
  confirmedStatus,
  confirmedAmount,
  tenantReportedAt,
  serverNow,
  isReporting = false,
  onReport,
}) => {
  const status = getRentDisplayStatus({ confirmedStatus, dueOn }, serverNow);
  const canReport = confirmedStatus === "unpaid" && tenantReportedAt === null;
  const awaitingStaff =
    confirmedStatus === "unpaid" && tenantReportedAt !== null;

  return (
    <SurfaceCard
      stripeColor={RENT_STRIPE[status] ?? COLORS.accent}
      paddingClassName="p-5"
    >
      <VStack spacing="md">
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
        <VStack spacing="none" className="border-y border-border py-4">
          <Text className="text-sm text-grey">Total Amount</Text>
          <Text className="font-app-bold text-3xl text-darkGrey">
            {formatMoney(amount, currency)}
          </Text>
        </VStack>
        {confirmedStatus === "partial" ? (
          <Text className="font-app-medium text-sm text-accentInk">
            {formatRentPartialLine(amount, confirmedAmount, currency)}
          </Text>
        ) : null}
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
        ) : awaitingStaff ? (
          <Text className="text-center font-app-medium text-sm text-grey">
            Reported. Ridgeway staff still confirm this.
          </Text>
        ) : null}
      </VStack>
    </SurfaceCard>
  );
};

export default TenantRentInvoiceCard;
