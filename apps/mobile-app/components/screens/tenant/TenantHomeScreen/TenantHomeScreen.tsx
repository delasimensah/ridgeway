import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Currency, RentConfirmedStatus, WorkOrderStatus } from "shared";

import TenantNextRentCard from "../../../rent/TenantNextRentCard/TenantNextRentCard";
import PersonAvatar from "../../../ui/PersonAvatar/PersonAvatar";
import ScrollableStack from "../../../ui/ScrollableStack/ScrollableStack";
import { HStack, VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface TenantHomeRepair {
  _id: string;
  title: string;
  status: WorkOrderStatus;
}

interface TenantHomeNextRent {
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
}

interface TenantHomeScreenProps {
  displayName: string;
  unitLabel: string;
  buildingName: string;
  address: string;
  nextRent: TenantHomeNextRent | null;
  serverNow: number;
  repairs: TenantHomeRepair[];
  onManageRent: () => void;
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
}) => {
  const insets = useSafeAreaInsets();

  return (
    <VStack
      spacing="none"
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 8 }}
    >
      <VStack spacing="sm" paddingX="md" className="pb-2 pt-3">
        <HStack align="center" justify="between">
          <Text className="font-app-bold text-xl tracking-tight text-darkGrey">
            Ridgeway
          </Text>
          <PersonAvatar displayName={displayName} size={32} />
        </HStack>
        <VStack spacing="none">
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
              serverNow={serverNow}
              onManageRent={onManageRent}
            />
          ) : null}
          <HStack align="center" justify="between" className="pt-2">
            <Text className="font-app-bold text-sm uppercase tracking-wider text-darkGrey">
              Active Repairs
            </Text>
          </HStack>
          {repairs.length === 0 ? (
            <Text className="text-base text-grey">No open repairs.</Text>
          ) : (
            repairs.map((repair) => (
              <VStack
                key={repair._id}
                spacing="none"
                className="rounded-lg border border-border bg-white p-4"
              >
                <Text className="font-app-bold text-base text-darkGrey">
                  {repair.title}
                </Text>
              </VStack>
            ))
          )}
        </VStack>
      </ScrollableStack>
    </VStack>
  );
};

export default TenantHomeScreen;
