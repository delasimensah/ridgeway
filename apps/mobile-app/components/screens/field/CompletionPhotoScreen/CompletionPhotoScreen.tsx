import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "@/constants";

import CompletionPhotoPicker from "../../../jobs/CompletionPhotoPicker/CompletionPhotoPicker";
import Button from "../../../ui/Button/Button";
import ScrollableStack from "../../../ui/ScrollableStack/ScrollableStack";
import { HStack, VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface CompletionPhotoScreenProps {
  uri: string | null;
  caption: string;
  isSaving: boolean;
  error: string | null;
  onChangeCaption: (value: string) => void;
  onPickPhoto: () => void;
  onSave: () => void;
  onBack: () => void;
}

const CompletionPhotoScreen: React.FC<CompletionPhotoScreenProps> = ({
  uri,
  caption,
  isSaving,
  error,
  onChangeCaption,
  onPickPhoto,
  onSave,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

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
          accessibilityLabel="Back"
          onPress={onBack}
          className="h-10 w-10 items-start justify-center"
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.darkGrey} />
        </Pressable>
        <Text className="flex-1 text-center font-app-bold text-lg text-darkGrey">
          Completion photo
        </Text>
        <VStack spacing="none" className="h-10 w-10" />
      </HStack>
      <ScrollableStack padding="md">
        <VStack spacing="lg">
          <CompletionPhotoPicker uri={uri} onPress={onPickPhoto} />
          <VStack spacing="sm">
            <Text className="font-app-bold text-sm uppercase tracking-wider text-grey">
              Caption (optional)
            </Text>
            <TextInput
              accessibilityLabel="Caption (optional)"
              value={caption}
              onChangeText={onChangeCaption}
              placeholder="Describe the work done..."
              placeholderTextColor={COLORS.grey}
              multiline
              className="min-h-[96px] rounded-md border border-border bg-white p-3 text-base text-darkGrey"
            />
          </VStack>
          {error ? <Text className="text-sm text-overdue">{error}</Text> : null}
        </VStack>
      </ScrollableStack>
      <VStack
        padding="md"
        className="border-t border-border bg-white"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          text="Save photo"
          fullWidth
          loading={isSaving}
          disabled={uri === null}
          onPress={onSave}
        />
      </VStack>
    </VStack>
  );
};

export default CompletionPhotoScreen;
