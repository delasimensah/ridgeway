"use client";

import { Button } from "@mantine/core";
import Link from "next/link";
import React from "react";

import BrandMark from "../../ui/BrandMark/BrandMark";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

const NotFoundPage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16 text-center">
      <BrandMark
        size="nav"
        headingClassName="mb-0 text-[22px] font-semibold tracking-tight text-darkGrey"
      />
      <Heading
        variant="page"
        className="mb-0 mt-10 max-w-md text-[32px] font-semibold leading-tight tracking-tight sm:text-4xl"
      >
        This page isn&apos;t here
      </Heading>
      <Text className="mt-3 max-w-sm text-grey">
        Nothing on Ridgeway uses this address.
      </Text>
      <Button
        component={Link}
        href="/"
        className="mt-8 h-auto rounded-[8px] bg-primary px-8 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover"
      >
        Back to Ridgeway
      </Button>
    </main>
  );
};

export default NotFoundPage;
