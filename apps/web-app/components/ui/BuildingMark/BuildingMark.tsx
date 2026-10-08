"use client";

import { Box } from "@mantine/core";
import Image from "next/image";
import React from "react";

import { buildingLookPhoto } from "@/utils";

interface BuildingMarkProps {
  name: string;
}

const BuildingMark: React.FC<BuildingMarkProps> = ({ name }) => {
  return (
    <Box
      aria-hidden
      className="h-12 w-12 shrink-0 overflow-hidden rounded-[8px] bg-primary"
    >
      <Image
        src={buildingLookPhoto(name)}
        alt=""
        width={48}
        height={48}
        className="h-full w-full bg-primary object-cover"
      />
    </Box>
  );
};

export default BuildingMark;
