import React from "react";
import { View } from "react-native";
import type { RentStatus } from "shared";
import { rentStatusLabel } from "shared";

import { COLORS } from "@/constants";

import { HStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";

interface RentStatusChipProps {
  status: RentStatus;
}

const TONE: Record<RentStatus, { dot: string; color: string }> = {
  paid: { dot: COLORS.dotGreen, color: COLORS.darkGrey },
  due: { dot: COLORS.dotBlue, color: COLORS.darkGrey },
  late: { dot: COLORS.dotRed, color: COLORS.darkGrey },
  partial: { dot: COLORS.dotGold, color: COLORS.darkGrey },
};

const RentStatusChip: React.FC<RentStatusChipProps> = ({ status }) => {
  const tone = TONE[status];

  return (
    <HStack
      spacing="xs"
      align="center"
      className="self-start rounded-full border border-border bg-white px-2 py-0.5"
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: tone.dot,
        }}
      />
      <Text
        className="font-app-medium text-[12px] leading-[16px]"
        style={{ color: tone.color }}
      >
        {rentStatusLabel(status)}
      </Text>
    </HStack>
  );
};

export default RentStatusChip;
