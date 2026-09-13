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
}

const CompletionPhotoPicker: React.FC<CompletionPhotoPickerProps> = ({
  uri,
  onPress,
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add completion photo"
      onPress={onPress}
      className="aspect-[4/3] w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-sidebar"
    >
      {uri ? (
        <Image
          source={{ uri }}
          className="h-full w-full rounded-lg"
          contentFit="cover"
        />
      ) : (
        <VStack spacing="sm" align="center">
          <Ionicons name="camera" size={32} color={COLORS.grey} />
          <Text className="font-app-bold text-grey">Add completion photo</Text>
        </VStack>
      )}
    </Pressable>
  );
};

export default CompletionPhotoPicker;
