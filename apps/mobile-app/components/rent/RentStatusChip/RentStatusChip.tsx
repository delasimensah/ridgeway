import React from "react";
import type { RentStatus } from "shared";
import { rentStatusLabel } from "shared";

import { COLORS } from "@/constants";

import { VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";

interface RentStatusChipProps {
  status: RentStatus;
}

const TONE: Record<RentStatus, { backgroundColor: string; color: string }> = {
  paid: { backgroundColor: COLORS.sidebar, color: COLORS.darkGrey },
  due: { backgroundColor: COLORS.sidebar, color: COLORS.grey },
  late: { backgroundColor: COLORS.overdue, color: COLORS.white },
  partial: { backgroundColor: COLORS.sidebar, color: COLORS.darkGrey },
};

const RentStatusChip: React.FC<RentStatusChipProps> = ({ status }) => {
  const tone = TONE[status];

  return (
    <VStack
      spacing="none"
      align="center"
      justify="center"
      className="self-start rounded-full px-2 py-0.5"
      style={{ backgroundColor: tone.backgroundColor }}
    >
      <Text
        className="font-app-bold text-[11px] uppercase leading-[16px]"
        style={{ color: tone.color }}
      >
        {rentStatusLabel(status)}
      </Text>
    </VStack>
  );
};

export default RentStatusChip;
