"use client";

import { Box } from "@mantine/core";
import React from "react";

import SignInForm from "../../auth/SignInForm/SignInForm";
import BrandMark from "../../ui/BrandMark/BrandMark";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";
import SignInSkyline from "./SignInSkyline";

const SignInPage: React.FC = () => {
  return (
    <Box className="grid min-h-screen lg:grid-cols-2">
      <Box className="hidden flex-col bg-sidebar p-12 lg:flex">
        <BrandMark
          size="nav"
          headingClassName="mb-0 text-[28px] font-semibold tracking-tight text-darkGrey"
        />
        <Box className="flex flex-1 flex-col justify-center py-10">
          <Heading
            variant="section"
            className="mb-8 max-w-[420px] text-[36px] font-semibold leading-tight tracking-tight text-darkGrey"
          >
            The buildings, the rent, and the repairs, in one place.
          </Heading>
          <SignInSkyline />
          <Text className="mt-6 max-w-[360px] text-base text-grey">
            Ridge Court, the rent that is still owed, and the repair that is
            open.
          </Text>
        </Box>
      </Box>
      <Box className="flex flex-col items-center justify-center bg-white p-4 sm:p-6">
        <Box className="flex w-full max-w-[400px] flex-col items-center">
          <BrandMark
            size="page"
            className="mb-8 sm:mb-12 lg:hidden"
            headingClassName="mb-0 text-center text-[28px] font-semibold tracking-tight text-darkGrey sm:text-[32px]"
          />
          <SignInForm />
          <Text className="mt-8 text-center text-sm text-grey sm:mt-12">
            Staff, owners, and tenants use this site.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default SignInPage;
