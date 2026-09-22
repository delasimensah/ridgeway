"use client";

import { Box } from "@mantine/core";
import React from "react";

import SignInForm from "../../auth/SignInForm/SignInForm";
import BrandMark from "../../ui/BrandMark/BrandMark";
import Text from "../../ui/Text/Text";

const SignInPage: React.FC = () => {
  return (
    <Box className="flex min-h-screen flex-col items-center justify-center bg-white p-4 sm:p-6">
      <Box className="flex w-full max-w-[400px] flex-col items-center">
        <BrandMark
          size="page"
          className="mb-8 sm:mb-12"
          headingClassName="mb-0 text-center text-[28px] font-bold tracking-tight text-darkGrey sm:text-[32px]"
        />
        <SignInForm />
        <Text className="mt-8 text-center text-sm text-grey sm:mt-12">
          Staff, owners, and tenants use this site.
        </Text>
      </Box>
    </Box>
  );
};

export default SignInPage;
