import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { type Currency, formatMoney, formatPeriodLabel } from "shared";

import { COLORS } from "@/constants";

import { HStack, VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";

interface TenantRentHistoryCardProps {
  periodLabel: string;
  amount: number;
  currency: Currency;
}

const TenantRentHistoryCard: React.FC<TenantRentHistoryCardProps> = ({
  periodLabel,
  amount,
  currency,
}) => {
  return (
    <HStack
      align="center"
      justify="between"
      className="rounded-lg border border-border bg-white p-4"
    >
      <VStack spacing="none">
        <Text className="font-app-bold text-[15px] text-darkGrey">
          {formatPeriodLabel(periodLabel)}
        </Text>
      </VStack>
      <VStack spacing="none" align="end">
        <Text className="font-app-bold text-[15px] text-darkGrey">
          {formatMoney(amount, currency)}
        </Text>
        <HStack spacing="xs" align="center">
          <Ionicons name="checkmark-circle" size={10} color={COLORS.darkGrey} />
          <Text className="font-app-bold text-[12px] text-darkGrey">Done</Text>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default TenantRentHistoryCard;
