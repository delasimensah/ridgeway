import { Image } from "expo-image";
import React from "react";

import { COLORS } from "@/constants";
import { personLookPhoto } from "@/utils";

interface PersonAvatarProps {
  displayName: string;
  size?: number;
}

const PersonAvatar: React.FC<PersonAvatarProps> = ({
  displayName,
  size = 32,
}) => {
  return (
    <Image
      source={personLookPhoto(displayName)}
      accessibilityLabel={displayName}
      contentFit="cover"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.primary,
      }}
    />
  );
};

export default PersonAvatar;
