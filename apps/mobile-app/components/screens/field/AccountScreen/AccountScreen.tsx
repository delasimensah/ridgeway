import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "../../../ui/Button/Button";
import PersonAvatar from "../../../ui/PersonAvatar/PersonAvatar";
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
        <PersonAvatar displayName={displayName} size={80} />
        <VStack spacing="none" align="center">
          <Text className="font-app-bold text-2xl text-darkGrey">
            {displayName}
          </Text>
          <Text className="font-app-medium text-grey">Field worker</Text>
        </VStack>
      </VStack>
      <Button
        text="Sign out"
        variant="danger"
        fullWidth
        loading={isSigningOut}
        onPress={onSignOut}
      />
    </VStack>
  );
};

export default AccountScreen;
