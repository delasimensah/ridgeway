import { Ionicons } from "@expo/vector-icons";
import React from "react";
import type { WorkOrderStatus, WorkOrderUrgency } from "shared";

import { COLORS } from "@/constants";
import { JOB_STATUS_STRIPE, repairMetaLine } from "@/utils";

import JobStatusChip from "../../jobs/JobStatusChip/JobStatusChip";
import { HStack, VStack } from "../../ui/Stack/Stack";
import SurfaceCard from "../../ui/SurfaceCard/SurfaceCard";
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
    <SurfaceCard
      stripeColor={JOB_STATUS_STRIPE[repair.status]}
      accessibilityLabel={repair.title}
      onPress={onPress}
    >
      <VStack spacing="sm">
        <HStack align="start" justify="between">
          <Text className="flex-1 pr-2 font-app-bold text-base text-darkGrey">
            {repair.title}
          </Text>
          <JobStatusChip status={repair.status} />
        </HStack>
        <HStack align="center" justify="between">
          <HStack spacing="sm" align="center" className="min-w-0 flex-1">
            <Ionicons name="construct" size={14} color={COLORS.grey} />
            <Text className="text-[13px] text-grey">
              {repairMetaLine(repair.category, repair.urgency)}
            </Text>
          </HStack>
          <Ionicons name="chevron-forward" size={16} color={COLORS.grey} />
        </HStack>
      </VStack>
    </SurfaceCard>
  );
};

export default TenantRepairCard;
