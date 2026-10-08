import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { KeyboardAvoidingView, Pressable, TextInput } from "react-native";

import { COLORS } from "@/constants";
import { useAppInsets } from "@/hooks";
import {
  REPAIR_CATEGORY_OPTIONS,
  REPAIR_URGENCY_OPTIONS,
  type RepairCategory,
  type RepairUrgency,
} from "@/utils";

import CompletionPhotoPicker from "../../../jobs/CompletionPhotoPicker/CompletionPhotoPicker";
import RepairChoiceField from "../../../repairs/RepairChoiceField/RepairChoiceField";
import Button from "../../../ui/Button/Button";
import ScrollableStack from "../../../ui/ScrollableStack/ScrollableStack";
import { HStack, VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface TenantFileRepairScreenProps {
  buildingName: string;
  unitLabel: string;
  description: string;
  category: RepairCategory | "";
  urgency: RepairUrgency | "";
  photoUri: string | null;
  isSubmitting: boolean;
  error: string | null;
  onChangeDescription: (value: string) => void;
  onChangeCategory: (value: RepairCategory) => void;
  onChangeUrgency: (value: RepairUrgency) => void;
  onPickPhoto: () => void;
  onSubmit: () => void;
  onBack: () => void;
}

const TenantFileRepairScreen: React.FC<TenantFileRepairScreenProps> = ({
  buildingName,
  unitLabel,
  description,
  category,
  urgency,
  photoUri,
  isSubmitting,
  error,
  onChangeDescription,
  onChangeCategory,
  onChangeUrgency,
  onPickPhoto,
  onSubmit,
  onBack,
}) => {
  const insets = useAppInsets();
  const [openField, setOpenField] = useState<"category" | "urgency" | null>(
    null
  );

  return (
    <VStack spacing="none" className="flex-1 bg-sidebar">
      <HStack
        align="center"
        justify="between"
        paddingX="md"
        className="border-b border-border bg-white"
        style={{ paddingTop: insets.top + 8, paddingBottom: 16 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          className="h-10 w-10 items-start justify-center"
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.darkGrey} />
        </Pressable>
        <Text className="flex-1 text-center font-app-bold text-lg text-darkGrey">
          File a repair
        </Text>
        <VStack spacing="none" className="h-10 w-10" />
      </HStack>
      <KeyboardAvoidingView className="flex-1 bg-sidebar" behavior="padding">
        <ScrollableStack
          padding="md"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <VStack spacing="lg" className="pb-8">
            {error ? (
              <Text className="text-sm text-overdue">{error}</Text>
            ) : null}
            <VStack spacing="sm">
              <Text className="font-app-bold text-[13px] uppercase tracking-wider text-grey">
                Your flat
              </Text>
              <VStack
                spacing="none"
                className="rounded-lg border border-border bg-white p-4"
              >
                <Text className="font-app-medium text-base text-darkGrey">
                  {buildingName} · {unitLabel}
                </Text>
                <Text className="mt-1 text-[13px] text-grey">
                  This repair is for the flat you live in.
                </Text>
              </VStack>
            </VStack>
            <VStack spacing="sm">
              <Text className="font-app-bold text-[13px] uppercase tracking-wider text-grey">
                What’s wrong?
              </Text>
              <TextInput
                accessibilityLabel="What’s wrong?"
                multiline
                textAlignVertical="top"
                placeholder="Describe the issue in detail..."
                placeholderTextColor={COLORS.grey}
                value={description}
                onChangeText={onChangeDescription}
                className="min-h-[120px] rounded-lg border border-border bg-white p-4 text-base text-darkGrey"
              />
            </VStack>
            <RepairChoiceField
              label="Category"
              placeholder="Select category"
              value={category}
              options={REPAIR_CATEGORY_OPTIONS}
              open={openField === "category"}
              onOpen={() => {
                setOpenField((current) =>
                  current === "category" ? null : "category"
                );
              }}
              onSelect={(value) => {
                onChangeCategory(value);
                setOpenField(null);
              }}
            />
            <RepairChoiceField
              label="Urgency"
              placeholder="Select urgency"
              value={urgency}
              options={REPAIR_URGENCY_OPTIONS}
              open={openField === "urgency"}
              onOpen={() => {
                setOpenField((current) =>
                  current === "urgency" ? null : "urgency"
                );
              }}
              onSelect={(value) => {
                onChangeUrgency(value);
                setOpenField(null);
              }}
            />
            <VStack spacing="sm">
              <Text className="font-app-bold text-[13px] uppercase tracking-wider text-grey">
                Photo
              </Text>
              <CompletionPhotoPicker
                uri={photoUri}
                label="Add a photo"
                onPress={onPickPhoto}
              />
            </VStack>
          </VStack>
        </ScrollableStack>
      </KeyboardAvoidingView>
      <VStack
        padding="md"
        className="border-t border-border bg-white"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          text="Submit repair"
          fullWidth
          loading={isSubmitting}
          onPress={onSubmit}
        />
      </VStack>
    </VStack>
  );
};

export default TenantFileRepairScreen;
