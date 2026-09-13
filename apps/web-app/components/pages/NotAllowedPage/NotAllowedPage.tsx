"use client";

import { Box, Button } from "@mantine/core";
import React from "react";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface NotAllowedPageProps {
  onSignOut: () => void;
  isSigningOut?: boolean;
}

const NotAllowedPage: React.FC<NotAllowedPageProps> = ({
  onSignOut,
  isSigningOut = false,
}) => {
  return (
    <Box className="flex min-h-screen flex-col items-center justify-center bg-white p-4 sm:p-6">
      <Box className="max-w-md text-center">
        <Heading
          variant="page"
          className="text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
        >
          You cannot open the office
        </Heading>
        <Text className="mb-8 text-base text-grey">
          This screen is for Ridgeway staff. Sign out and use the account the
          office gave you.
        </Text>
        <Button
          onClick={onSignOut}
          loading={isSigningOut}
          className="h-auto w-full rounded-[8px] bg-danger px-6 py-3 text-base font-semibold text-white hover:bg-dangerHover sm:w-auto"
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );
};

export default NotAllowedPage;
