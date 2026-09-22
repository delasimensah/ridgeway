import React from "react";

import BrandMark from "../../ui/BrandMark/BrandMark";
import { VStack } from "../../ui/Stack/Stack";

const RoleWaitScreen: React.FC = () => {
  return (
    <VStack align="center" justify="center" className="flex-1 bg-accent">
      <BrandMark
        size="splash"
        accessibilityRole="header"
        textClassName="font-app-bold text-[32px] tracking-tight text-primary"
      />
    </VStack>
  );
};

export default RoleWaitScreen;
