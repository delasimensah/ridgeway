"use client";

import { Stack, ThemeIcon } from "@mantine/core";
import { IconKey } from "@tabler/icons-react";
import React from "react";

import { COLORS } from "@/constants";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface TenantLeaseEndedNoticeProps {
  unitLabel: string;
  buildingName: string;
}

const TenantLeaseEndedNotice: React.FC<TenantLeaseEndedNoticeProps> = ({
  unitLabel,
  buildingName,
}) => {
  return (
    <Stack align="center" gap="lg">
      <ThemeIcon
        size={64}
        radius="xl"
        variant="transparent"
        className="bg-sidebar"
      >
        <IconKey size={24} color={COLORS.grey} />
      </ThemeIcon>
      <Stack gap="sm" className="text-center">
        <Heading
          variant="page"
          className="mb-0 text-[24px] font-bold leading-tight text-darkGrey sm:text-[32px]"
        >
          You no longer have access to this unit
        </Heading>
        <Text className="text-base leading-relaxed text-grey sm:text-lg">
          The lease for {buildingName} {unitLabel} has ended. If you believe
          this is an error, please contact Ridgeway Property Group directly.
        </Text>
      </Stack>
    </Stack>
  );
};

export default TenantLeaseEndedNotice;
