"use client";

import { Avatar } from "@mantine/core";
import React from "react";
import { cn, getDisplayInitials } from "shared";

import { personLookPhoto } from "@/utils";

interface PersonAvatarProps {
  displayName: string;
  size?: number;
  className?: string;
  /** The name is already written beside this picture. */
  decorative?: boolean;
}

const PersonAvatar: React.FC<PersonAvatarProps> = ({
  displayName,
  size = 32,
  className,
  decorative = false,
}) => {
  return (
    <Avatar
      src={personLookPhoto(displayName)}
      alt={decorative ? "" : displayName}
      name={displayName}
      radius="xl"
      size={size}
      className={cn(
        "shrink-0 border border-border bg-primary text-[12px] font-bold text-white",
        className
      )}
      classNames={{
        placeholder: "bg-primary text-white",
        image: "bg-primary",
      }}
    >
      {getDisplayInitials(displayName)}
    </Avatar>
  );
};

export default PersonAvatar;
