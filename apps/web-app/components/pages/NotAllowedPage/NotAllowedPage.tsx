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
    <Box className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
      <Box className="max-w-[480px]">
        <Heading
          variant="page"
          className="mb-16 text-[32px] font-bold tracking-tight text-darkGrey"
        >
          Ridgeway
        </Heading>
        <Heading
          variant="section"
          className="mb-6 text-[24px] font-bold leading-tight text-darkGrey sm:text-[28px]"
        >
          You don’t have permission to see this page.
        </Heading>
        <Text className="text-base leading-relaxed text-grey">
          Your account doesn&apos;t have the required access level for this
          area. If you believe this is an error, please reach out to your
          property manager.
        </Text>
        <Button
          onClick={onSignOut}
          loading={isSigningOut}
          className="mt-12 h-auto rounded-[8px] bg-primary px-10 py-3.5 text-base font-semibold text-white hover:bg-primaryHover"
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );
};

export default NotAllowedPage;
