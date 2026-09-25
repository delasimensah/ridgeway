import React from "react";
import {
  type Currency,
  formatDateString,
  formatMoney,
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

interface TenantNextRentCardProps {
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
  confirmedAmount?: number | null;
  serverNow: number;
  onManageRent: () => void;
}

const RENT_STRIPE: Record<string, string> = {
  paid: COLORS.primary,
  due: COLORS.grey,
  late: COLORS.overdue,
  partial: COLORS.accent,
};

const TenantNextRentCard: React.FC<TenantNextRentCardProps> = ({
  amount,
  currency,
  dueOn,
  confirmedStatus,
  confirmedAmount = null,
  serverNow,
  onManageRent,
}) => {
  const status = getRentDisplayStatus({ confirmedStatus, dueOn }, serverNow);

  return (
    <SurfaceCard stripeColor={RENT_STRIPE[status] ?? COLORS.accent}>
      <VStack spacing="sm">
        <HStack align="start" justify="between">
          <Text className="font-app-medium text-[13px] uppercase tracking-wider text-grey">
            Next Rent
          </Text>
          <RentStatusChip status={status} />
        </HStack>
        <Text className="font-app-bold text-3xl text-darkGrey">
          {formatMoney(amount, currency)}
        </Text>
        <Text className="text-sm text-grey">
          Due {formatDateString(dueOn, "d MMM yyyy")}
        </Text>
        {confirmedStatus === "partial" ? (
          <Text className="text-sm text-grey">
            {formatRentPartialLine(amount, confirmedAmount, currency)}
          </Text>
        ) : null}
        <Button text="Manage Rent" fullWidth onPress={onManageRent} />
      </VStack>
    </SurfaceCard>
  );
};

export default TenantNextRentCard;
