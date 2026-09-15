import React, { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "../../../ui/Button/Button";
import PersonAvatar from "../../../ui/PersonAvatar/PersonAvatar";
import { VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface AccountScreenProps {
  displayName: string;
  roleLabel: string;
  isSigningOut: boolean;
  onSignOut: () => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({
  displayName,
  roleLabel,
  isSigningOut,
  onSignOut,
}) => {
  const insets = useSafeAreaInsets();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const closeConfirm = () => {
    if (!isSigningOut) {
      setConfirmOpen(false);
    }
  };

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
          <Text className="font-app-medium text-grey">{roleLabel}</Text>
        </VStack>
      </VStack>
      <Button
        text="Sign out"
        variant="danger"
        fullWidth
        accessibilityLabel="Sign out"
        onPress={() => {
          setConfirmOpen(true);
        }}
      />
      <Modal
        visible={confirmOpen}
        transparent
        animationType="fade"
        onRequestClose={closeConfirm}
      >
        <View className="flex-1 items-center justify-center px-6">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss sign out"
            className="absolute inset-0 bg-black/40"
            onPress={closeConfirm}
          />
          <VStack
            spacing="md"
            className="w-full rounded-lg border border-border bg-white p-5"
          >
            <Text className="font-app-bold text-lg text-darkGrey">
              Sign out?
            </Text>
            <Text className="text-sm text-grey">
              You will need your email and password to sign in again.
            </Text>
            <VStack spacing="sm">
              <Button
                text="Sign out"
                variant="danger"
                fullWidth
                loading={isSigningOut}
                accessibilityLabel="Confirm sign out"
                onPress={onSignOut}
              />
              <Button
                text="Cancel"
                variant="ghost"
                fullWidth
                disabled={isSigningOut}
                onPress={closeConfirm}
              />
            </VStack>
          </VStack>
        </View>
      </Modal>
    </VStack>
  );
};

export default AccountScreen;
