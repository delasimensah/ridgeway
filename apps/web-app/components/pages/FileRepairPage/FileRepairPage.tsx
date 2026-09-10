"use client";

import { Anchor, Box } from "@mantine/core";
import Link from "next/link";
import React from "react";

import FileRepairForm from "../../repairs/FileRepairForm/FileRepairForm";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface FileRepairPageProps {
  unitId: string;
  buildingName: string;
  unitLabel: string;
}

const FileRepairPage: React.FC<FileRepairPageProps> = ({
  unitId,
  buildingName,
  unitLabel,
}) => {
  return (
    <Box className="mx-auto w-full max-w-[640px] px-4 py-8 sm:px-6 sm:py-12">
      <Anchor
        component={Link}
        href="/"
        underline="never"
        className="mb-6 inline-flex text-sm font-medium text-grey hover:text-darkGrey"
      >
        Back to home
      </Anchor>
      <Heading
        variant="page"
        className="mb-8 text-[24px] font-bold text-darkGrey sm:mb-10 sm:text-[32px]"
      >
        File a repair
      </Heading>
      <Box className="mb-8 flex items-center justify-between rounded-[8px] bg-sidebar p-4">
        <Box>
          <Text className="mb-1 text-[12px] font-bold uppercase tracking-wider text-grey">
            Unit
          </Text>
          <Text className="font-semibold text-darkGrey">
            {buildingName} · {unitLabel}
          </Text>
        </Box>
        <Box className="text-right">
          <Text className="mb-1 text-[12px] font-bold uppercase tracking-wider text-grey">
            Status
          </Text>
          <Text
            component="span"
            className="rounded-full bg-grey px-3 py-1 text-[10px] font-bold uppercase text-white"
          >
            New
          </Text>
        </Box>
      </Box>
      <FileRepairForm unitId={unitId as never} />
    </Box>
  );
};

export default FileRepairPage;
