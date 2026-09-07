"use client";

import { Box } from "@mantine/core";
import React from "react";

import SignInForm from "../../auth/SignInForm/SignInForm";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

const SignInPage: React.FC = () => {
  return (
    <Box className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
      <Box className="flex w-full max-w-[400px] flex-col items-center">
        <Heading
          variant="page"
          className="mb-12 text-center text-[32px] font-bold tracking-tight text-darkGrey"
        >
          Ridgeway
        </Heading>
        <SignInForm />
        <Text className="mt-12 text-center text-sm text-grey">
          Office, owners, and tenants use this site.
        </Text>
      </Box>
    </Box>
  );
};

export default SignInPage;
