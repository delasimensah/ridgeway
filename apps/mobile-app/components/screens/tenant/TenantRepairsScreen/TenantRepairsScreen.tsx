import React from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { TenantRepairCardItem } from "../../../repairs/TenantRepairCard/TenantRepairCard";
import TenantRepairCard from "../../../repairs/TenantRepairCard/TenantRepairCard";
import ListEmpty from "../../../ui/ListEmpty/ListEmpty";
import ScrollableStack from "../../../ui/ScrollableStack/ScrollableStack";
import { HStack, VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface TenantRepairsScreenProps {
  repairs: TenantRepairCardItem[];
  onFileRepair: () => void;
  onOpenRepair: (workOrderId: string) => void;
}

const TenantRepairsScreen: React.FC<TenantRepairsScreenProps> = ({
  repairs,
  onFileRepair,
  onOpenRepair,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <VStack
      spacing="none"
      className="flex-1 bg-sidebar"
      style={{ paddingTop: insets.top + 8 }}
    >
      <HStack
        align="center"
        justify="between"
        paddingX="md"
        className="pb-2 pt-3"
      >
        <Text className="font-app-bold text-3xl text-darkGrey">Repairs</Text>
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
      <ScrollableStack paddingX="md" paddingY="sm" className="flex-1">
        <VStack spacing="sm" className="pb-8">
          {repairs.length === 0 ? (
            <ListEmpty
              message="No open repairs."
              actionLabel="File a repair"
              onAction={onFileRepair}
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

export default TenantRepairsScreen;
