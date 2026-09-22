import React from "react";

import { useAppInsets } from "@/hooks";

import BrandMark from "../../../ui/BrandMark/BrandMark";
import Button from "../../../ui/Button/Button";
import { VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface NotAllowedScreenProps {
  isSigningOut: boolean;
  onSignOut: () => void;
}

const NotAllowedScreen: React.FC<NotAllowedScreenProps> = ({
  isSigningOut,
  onSignOut,
}) => {
  const insets = useAppInsets();

  return (
    <VStack
      spacing="lg"
      align="center"
      justify="center"
      paddingX="xl"
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <BrandMark
        size="page"
        textClassName="font-app-bold text-2xl text-darkGrey"
      />
      <VStack spacing="sm" align="center">
        <Text className="text-center font-app-bold text-xl text-darkGrey">
          You don’t have permission to see this page.
        </Text>
        <Text className="text-center font-app-medium text-grey">
          Please contact your administrator if you believe this is an error.
        </Text>
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

export default NotAllowedScreen;
