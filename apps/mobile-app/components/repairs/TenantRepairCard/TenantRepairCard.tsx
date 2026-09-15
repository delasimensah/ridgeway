import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
import type { WorkOrderStatus, WorkOrderUrgency } from "shared";

import { COLORS } from "@/constants";
import { repairMetaLine } from "@/utils";

import JobStatusChip from "../../jobs/JobStatusChip/JobStatusChip";
import { HStack, VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";

export interface TenantRepairCardItem {
  _id: string;
  title: string;
  status: WorkOrderStatus;
  category: string | null;
  urgency: WorkOrderUrgency;
}

interface TenantRepairCardProps {
  repair: TenantRepairCardItem;
  onPress: () => void;
}

const TenantRepairCard: React.FC<TenantRepairCardProps> = ({
  repair,
  onPress,
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={repair.title}
      onPress={onPress}
      className="rounded-lg border border-border bg-white p-4"
    >
      <VStack spacing="sm">
        <HStack align="start" justify="between">
          <Text className="flex-1 font-app-bold text-base text-darkGrey">
            {repair.title}
          </Text>
          <JobStatusChip status={repair.status} />
        </HStack>
        <HStack spacing="sm" align="center">
          <Ionicons name="construct" size={14} color={COLORS.grey} />
          <Text className="text-[13px] text-grey">
            {repairMetaLine(repair.category, repair.urgency)}
          </Text>
        </HStack>
        <HStack align="center" justify="between">
          <Text className="font-app-medium text-[13px] text-darkGrey">
            View status timeline
          </Text>
          <Ionicons name="chevron-forward" size={12} color={COLORS.darkGrey} />
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default TenantRepairCard;
