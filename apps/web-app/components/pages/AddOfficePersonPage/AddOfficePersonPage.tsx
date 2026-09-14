"use client";

import type { Id } from "@convex/_generated/dataModel";
import { Anchor, Box, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

import type { OfficePersonFormValues } from "@/utils";

import AddOfficePersonForm from "../../office/AddOfficePersonForm/AddOfficePersonForm";
import Heading from "../../ui/Heading/Heading";

interface AddOfficePersonPageProps {
  profileId?: Id<"profiles">;
  initialValues?: OfficePersonFormValues;
}

const AddOfficePersonPage: React.FC<AddOfficePersonPageProps> = ({
  profileId,
  initialValues,
}) => {
  return (
    <Box className="max-w-[800px]">
      <Box className="mb-8 sm:mb-10">
        <Group gap={8} className="mb-2 text-[14px] font-medium">
          <Anchor
            component={Link}
            href="/office"
            underline="never"
            className="text-grey hover:text-darkGrey"
          >
            Staff
          </Anchor>
        </Group>
        <Heading
          variant="page"
          className="mb-0 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
        >
          {profileId === undefined ? "Add office person" : "Edit office person"}
        </Heading>
      </Box>
      <Box className="rounded-[8px] border border-border bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <AddOfficePersonForm
          key={profileId ?? "new"}
          profileId={profileId}
          initialValues={initialValues}
        />
      </Box>
    </Box>
  );
};

export default AddOfficePersonPage;
