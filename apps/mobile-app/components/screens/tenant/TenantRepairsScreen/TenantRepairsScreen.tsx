import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { WorkOrderStatus } from "shared";

import ScrollableStack from "../../../ui/ScrollableStack/ScrollableStack";
import { VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface TenantRepairItem {
  _id: string;
  title: string;
  status: WorkOrderStatus;
}

interface TenantRepairsScreenProps {
  repairs: TenantRepairItem[];
}

const TenantRepairsScreen: React.FC<TenantRepairsScreenProps> = ({
  repairs,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <VStack
      spacing="none"
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 8 }}
    >
      <VStack spacing="none" paddingX="md" className="pb-2 pt-3">
        <Text className="font-app-bold text-2xl text-darkGrey">Repairs</Text>
      </VStack>
      <ScrollableStack paddingX="md" paddingY="sm" className="flex-1">
        <VStack spacing="sm" className="pb-8">
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

export default TenantRepairsScreen;
