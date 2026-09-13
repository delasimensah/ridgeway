import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
import type { WorkOrderStatus } from "shared";

import { COLORS } from "@/constants";
import { useAppInsets } from "@/hooks";

import JobStatusOption from "../../../jobs/JobStatusOption/JobStatusOption";
import Button from "../../../ui/Button/Button";
import ScrollableStack from "../../../ui/ScrollableStack/ScrollableStack";
import { HStack, VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface UpdateStatusScreenProps {
  currentStatus: WorkOrderStatus;
  options: WorkOrderStatus[];
  selected: WorkOrderStatus;
  isSaving: boolean;
  onSelect: (status: WorkOrderStatus) => void;
  onSave: () => void;
  onClose: () => void;
}

const UpdateStatusScreen: React.FC<UpdateStatusScreenProps> = ({
  currentStatus,
  options,
  selected,
  isSaving,
  onSelect,
  onSave,
  onClose,
}) => {
  const insets = useAppInsets();

  return (
    <VStack spacing="none" className="flex-1 bg-white">
      <HStack
        align="center"
        justify="between"
        paddingX="md"
        className="border-b border-border"
        style={{ paddingTop: insets.top + 8, paddingBottom: 16 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
          className="h-10 w-10 items-start justify-center"
        >
          <Ionicons name="close" size={22} color={COLORS.darkGrey} />
        </Pressable>
        <Text className="flex-1 text-center font-app-bold text-lg text-darkGrey">
          Update status
        </Text>
        <VStack spacing="none" className="h-10 w-10" />
      </HStack>
      <ScrollableStack padding="md">
        <VStack spacing="md">
          {options.map((status) => (
            <JobStatusOption
              key={status}
              status={status}
              label={status === currentStatus ? "Current status" : undefined}
              selected={selected === status}
              onPress={() => onSelect(status)}
            />
          ))}
        </VStack>
      </ScrollableStack>
      <VStack
        padding="md"
        className="border-t border-border bg-white"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          text="Save status"
          fullWidth
          loading={isSaving}
          onPress={onSave}
        />
      </VStack>
    </VStack>
  );
};

export default UpdateStatusScreen;
