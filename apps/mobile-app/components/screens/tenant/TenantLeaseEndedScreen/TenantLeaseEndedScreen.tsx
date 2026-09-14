import React from "react";

import { useAppInsets } from "@/hooks";

import Button from "../../../ui/Button/Button";
import { VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface TenantLeaseEndedScreenProps {
  unitLabel: string;
  buildingName: string;
  isSigningOut: boolean;
  onSignOut: () => void;
}

const TenantLeaseEndedScreen: React.FC<TenantLeaseEndedScreenProps> = ({
  unitLabel,
  buildingName,
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
      <Text className="font-app-bold text-xl text-darkGrey">Ridgeway</Text>
      <VStack spacing="sm" align="center">
        <Text className="text-center font-app-bold text-2xl text-darkGrey">
          You no longer have access to this unit
        </Text>
        <Text className="text-center font-app-medium text-grey">
          The lease for {buildingName} {unitLabel} has ended. If you believe
          this is an error, please contact Ridgeway Property Group.
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

export default TenantLeaseEndedScreen;
