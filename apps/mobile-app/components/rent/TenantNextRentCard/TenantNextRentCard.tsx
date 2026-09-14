import React from "react";
import {
  type Currency,
  formatDateString,
  formatMoney,
  getRentDisplayStatus,
  type RentConfirmedStatus,
} from "shared";

import Button from "../../ui/Button/Button";
import { HStack, VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";
import RentStatusChip from "../RentStatusChip/RentStatusChip";

interface TenantNextRentCardProps {
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
  serverNow: number;
  onManageRent: () => void;
}

const TenantNextRentCard: React.FC<TenantNextRentCardProps> = ({
  amount,
  currency,
  dueOn,
  confirmedStatus,
  serverNow,
  onManageRent,
}) => {
  const status = getRentDisplayStatus({ confirmedStatus, dueOn }, serverNow);

  return (
    <VStack
      spacing="sm"
      className="rounded-lg border border-border bg-white p-4"
    >
      <HStack align="start" justify="between">
        <Text className="font-app-medium text-[13px] uppercase tracking-wider text-grey">
          Next Rent
        </Text>
        <RentStatusChip status={status} />
      </HStack>
      <Text className="font-app-bold text-2xl text-darkGrey">
        {formatMoney(amount, currency)}
      </Text>
      <Text className="text-sm text-grey">
        Due {formatDateString(dueOn, "d MMM yyyy")}
      </Text>
      <Button text="Manage Rent" fullWidth onPress={onManageRent} />
    </VStack>
  );
};

export default TenantNextRentCard;
