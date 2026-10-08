"use client";

import type { Id } from "@convex/_generated/dataModel";
import { Anchor, Box, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

import type { FieldWorkerFormValues } from "@/utils";

import AddFieldWorkerForm from "../../field/AddFieldWorkerForm/AddFieldWorkerForm";
import Heading from "../../ui/Heading/Heading";

interface AddFieldWorkerPageProps {
  profileId?: Id<"profiles">;
  initialValues?: FieldWorkerFormValues;
}

const AddFieldWorkerPage: React.FC<AddFieldWorkerPageProps> = ({
  profileId,
  initialValues,
}) => {
  return (
    <Box className="max-w-[800px]">
      <Box className="mb-8 sm:mb-10">
        <Group gap={8} className="mb-2 text-[14px] font-medium">
          <Anchor
            component={Link}
            href="/users"
            underline="never"
            className="text-grey hover:text-darkGrey"
          >
            Users
          </Anchor>
        </Group>
        <Heading
          variant="page"
          className="mb-0 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
        >
          {profileId === undefined ? "Add field worker" : "Edit field worker"}
        </Heading>
      </Box>
      <Box className="rounded-[8px] border border-border bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <AddFieldWorkerForm
          key={profileId ?? "new"}
          profileId={profileId}
          initialValues={initialValues}
        />
      </Box>
    </Box>
  );
};

export default AddFieldWorkerPage;
