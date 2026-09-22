"use client";

import { Box, Button, Stack } from "@mantine/core";
import React from "react";

import TenantLeaseEndedNotice from "../../tenants/TenantLeaseEndedNotice/TenantLeaseEndedNotice";
import BrandMark from "../../ui/BrandMark/BrandMark";
import Text from "../../ui/Text/Text";

interface TenantLeaseEndedPageProps {
  unitLabel: string;
  buildingName: string;
  onSignOut: () => void;
  isSigningOut?: boolean;
}

const TenantLeaseEndedPage: React.FC<TenantLeaseEndedPageProps> = ({
  unitLabel,
  buildingName,
  onSignOut,
  isSigningOut = false,
}) => {
  const year = new Date().getFullYear();

  return (
    <Box className="flex min-h-screen flex-col items-center justify-center bg-white p-4 sm:p-6">
      <Stack
        className="w-full max-w-[480px] text-center"
        align="center"
        gap={0}
      >
        <BrandMark
          size="page"
          className="mb-12 sm:mb-16"
          headingClassName="mb-0 text-[24px] font-bold tracking-tight text-darkGrey"
        />
        <TenantLeaseEndedNotice
          unitLabel={unitLabel}
          buildingName={buildingName}
        />
        <Button
          onClick={onSignOut}
          loading={isSigningOut}
          className="mt-8 h-auto w-full rounded-[8px] bg-danger py-4 text-base font-semibold text-white hover:bg-dangerHover"
        >
          Sign out
        </Button>
        <Text className="mt-16 text-[14px] text-grey sm:mt-24">
          &copy; {year} Ridgeway Property Group
        </Text>
      </Stack>
    </Box>
  );
};

export default TenantLeaseEndedPage;
