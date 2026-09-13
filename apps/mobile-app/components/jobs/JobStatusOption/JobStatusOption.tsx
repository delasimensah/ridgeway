import React from "react";
import { Pressable } from "react-native";
import type { WorkOrderStatus } from "shared";

import { HStack, VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";
import JobStatusChip from "../JobStatusChip/JobStatusChip";

interface JobStatusOptionProps {
  status: WorkOrderStatus;
  label?: string;
  selected: boolean;
  onPress: () => void;
}

const JobStatusOption: React.FC<JobStatusOptionProps> = ({
  status,
  label,
  selected,
  onPress,
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label ?? status}
      onPress={onPress}
      className={`rounded-lg border p-4 ${
        selected ? "border-primary bg-sidebar" : "border-border bg-white"
      }`}
    >
      <HStack align="center" justify="between">
        <HStack spacing="md" align="center">
          <JobStatusChip status={status} />
          {label ? (
            <Text className="font-app-bold text-darkGrey">{label}</Text>
          ) : null}
        </HStack>
        <VStack
          spacing="none"
          className={`h-5 w-5 rounded-full border ${
            selected ? "border-primary bg-primary" : "border-border"
          }`}
        />
      </HStack>
    </Pressable>
  );
};

export default JobStatusOption;
