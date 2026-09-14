import React from "react";
import { getDisplayInitials } from "shared";

import { COLORS } from "@/constants";

import { VStack } from "../Stack/Stack";
import Text from "../Text/Text";

interface PersonAvatarProps {
  displayName: string;
  size?: number;
}

const PersonAvatar: React.FC<PersonAvatarProps> = ({
  displayName,
  size = 32,
}) => {
  const fontSize = size <= 32 ? 11 : size <= 48 ? 14 : 20;

  return (
    <VStack
      spacing="none"
      align="center"
      justify="center"
      accessibilityLabel={displayName}
      className="rounded-full border border-border bg-primary"
      style={{ width: size, height: size }}
    >
      <Text
        className="font-app-bold uppercase text-white"
        style={{ color: COLORS.white, fontSize, lineHeight: fontSize + 2 }}
      >
        {getDisplayInitials(displayName)}
      </Text>
    </VStack>
  );
};

export default PersonAvatar;
