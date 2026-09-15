import React from "react";

import { VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";

const RoleWaitScreen: React.FC = () => {
  return (
    <VStack align="center" justify="center" className="flex-1 bg-accent">
      <Text
        accessibilityRole="header"
        className="font-app-bold text-[32px] tracking-tight text-primary"
      >
        Ridgeway
      </Text>
    </VStack>
  );
};

export default RoleWaitScreen;
