import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "@/constants";

import Button from "../../../ui/Button/Button";
import { VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface AccountScreenProps {
  displayName: string;
  isSigningOut: boolean;
  onSignOut: () => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({
  displayName,
  isSigningOut,
  onSignOut,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <VStack
      spacing="lg"
      paddingX="md"
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 24 }}
    >
      <VStack spacing="md" align="center">
        <VStack
          spacing="none"
          align="center"
          justify="center"
          className="h-20 w-20 rounded-full bg-sidebar"
        >
          <Ionicons name="person" size={32} color={COLORS.grey} />
        </VStack>
        <VStack spacing="none" align="center">
          <Text className="font-app-bold text-2xl text-darkGrey">
            {displayName}
          </Text>
          <Text className="font-app-medium text-grey">Field</Text>
        </VStack>
      </VStack>
      <Button
        text="Sign out"
        fullWidth
        loading={isSigningOut}
        onPress={onSignOut}
      />
    </VStack>
  );
};

export default AccountScreen;
