import React from "react";
import { View } from "react-native";
import type { WorkOrderStatus } from "shared";

import { COLORS } from "@/constants";
import { JOB_STATUS_LABEL } from "@/utils";

import Text from "../../ui/Text/Text";

interface JobStatusChipProps {
  status: WorkOrderStatus;
}

const JOB_STATUS_CHIP_TONE: Record<
  WorkOrderStatus,
  { backgroundColor: string; color: string }
> = {
  received: { backgroundColor: COLORS.grey, color: COLORS.white },
  assigned: { backgroundColor: COLORS.primaryHover, color: COLORS.white },
  scheduled: { backgroundColor: COLORS.accent, color: COLORS.darkGrey },
  done: { backgroundColor: COLORS.primary, color: COLORS.white },
};

const JobStatusChip: React.FC<JobStatusChipProps> = ({ status }) => {
  const tone = JOB_STATUS_CHIP_TONE[status];

  return (
    <View
      className="self-start rounded-full px-2.5 py-1"
      style={{ backgroundColor: tone.backgroundColor }}
    >
      <Text
        className="font-app-bold text-[12px] capitalize leading-[16px]"
        style={{ color: tone.color }}
      >
        {JOB_STATUS_LABEL[status]}
      </Text>
    </View>
  );
};

export default JobStatusChip;
