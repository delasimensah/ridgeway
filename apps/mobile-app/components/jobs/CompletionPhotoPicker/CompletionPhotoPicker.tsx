import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable } from "react-native";

import { COLORS } from "@/constants";

import { VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";

interface CompletionPhotoPickerProps {
  uri: string | null;
  onPress: () => void;
  label?: string;
}

const CompletionPhotoPicker: React.FC<CompletionPhotoPickerProps> = ({
  uri,
  onPress,
  label = "Add completion photo",
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="aspect-[4/3] w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-sidebar"
    >
      {uri ? (
        <Image
          source={{ uri }}
          className="h-full w-full rounded-lg bg-primary"
          style={{ backgroundColor: COLORS.primary }}
          contentFit="cover"
        />
      ) : (
        <VStack spacing="sm" align="center">
          <Ionicons name="camera" size={40} color={COLORS.darkGrey} />
          <Text className="font-app-bold text-base text-darkGrey">{label}</Text>
          <Text className="text-sm text-grey">Tap to take a photo</Text>
        </VStack>
      )}
    </Pressable>
  );
};

export default CompletionPhotoPicker;
