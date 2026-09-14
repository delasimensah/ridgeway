"use client";

import { Avatar } from "@mantine/core";
import React from "react";
import { cn, getDisplayInitials } from "shared";

interface PersonAvatarProps {
  displayName: string;
  size?: number;
  className?: string;
}

const PersonAvatar: React.FC<PersonAvatarProps> = ({
  displayName,
  size = 32,
  className,
}) => {
  return (
    <Avatar
      alt={displayName}
      name={displayName}
      radius="xl"
      size={size}
      className={cn(
        "shrink-0 border border-border bg-primary text-[12px] font-bold text-white",
        className
      )}
      classNames={{
        placeholder: "bg-primary text-white",
      }}
    >
      {getDisplayInitials(displayName)}
    </Avatar>
  );
};

export default PersonAvatar;
