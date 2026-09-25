import React from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Currency, RentConfirmedStatus } from "shared";

import TenantNextRentCard from "../../../rent/TenantNextRentCard/TenantNextRentCard";
import type { TenantRepairCardItem } from "../../../repairs/TenantRepairCard/TenantRepairCard";
import TenantRepairCard from "../../../repairs/TenantRepairCard/TenantRepairCard";
import ListEmpty from "../../../ui/ListEmpty/ListEmpty";
import PersonAvatar from "../../../ui/PersonAvatar/PersonAvatar";
import ScrollableStack from "../../../ui/ScrollableStack/ScrollableStack";
import { HStack, VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface TenantHomeNextRent {
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
  confirmedAmount?: number | null;
}

interface TenantHomeScreenProps {
  displayName: string;
  unitLabel: string;
  buildingName: string;
  address: string;
  nextRent: TenantHomeNextRent | null;
  serverNow: number;
  repairs: TenantRepairCardItem[];
  onManageRent: () => void;
  onFileRepair: () => void;
  onOpenRepair: (workOrderId: string) => void;
}

const TenantHomeScreen: React.FC<TenantHomeScreenProps> = ({
  displayName,
  unitLabel,
  buildingName,
  address,
  nextRent,
  serverNow,
  repairs,
  onManageRent,
  onFileRepair,
  onOpenRepair,
}) => {
  const insets = useSafeAreaInsets();
  const firstName = displayName.trim().split(/\s+/)[0] || displayName;

  return (
    <VStack
      spacing="none"
      className="flex-1 bg-sidebar"
      style={{ paddingTop: insets.top + 8 }}
    >
      <VStack spacing="sm" paddingX="md" className="pb-2 pt-3">
        <HStack align="center" justify="between">
          <Text
            className="font-app-bold text-3xl text-darkGrey"
            accessibilityRole="header"
          >
            Home
          </Text>
          <PersonAvatar displayName={displayName} size={32} />
        </HStack>
        <VStack spacing="none">
          <Text className="font-app-medium text-[13px] text-grey">
            Hello, {firstName}
          </Text>
          <Text className="font-app-bold text-2xl text-darkGrey">
            {unitLabel} · {buildingName}
          </Text>
          <Text className="text-sm text-grey">{address}</Text>
        </VStack>
      </VStack>
      <ScrollableStack paddingX="md" paddingY="sm" className="flex-1">
        <VStack spacing="md" className="pb-8">
          {nextRent !== null ? (
            <TenantNextRentCard
              amount={nextRent.amount}
              currency={nextRent.currency}
              dueOn={nextRent.dueOn}
              confirmedStatus={nextRent.confirmedStatus}
              confirmedAmount={nextRent.confirmedAmount}
              serverNow={serverNow}
              onManageRent={onManageRent}
            />
          ) : null}
          <HStack align="center" justify="between" className="pt-2">
            <Text className="font-app-bold text-sm uppercase tracking-wider text-darkGrey">
              Active Repairs
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="File a repair"
              onPress={onFileRepair}
              hitSlop={8}
            >
              <Text className="font-app-medium text-sm text-primary">
                + File a repair
              </Text>
            </Pressable>
          </HStack>
          {repairs.length === 0 ? (
            <ListEmpty
              message="No open repairs."
              actionLabel="File a repair"
              onAction={onFileRepair}
              className="py-6"
            />
          ) : (
            repairs.map((repair) => (
              <TenantRepairCard
                key={repair._id}
                repair={repair}
                onPress={() => onOpenRepair(repair._id)}
              />
            ))
          )}
        </VStack>
      </ScrollableStack>
    </VStack>
  );
};

export default TenantHomeScreen;
