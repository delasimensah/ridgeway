"use client";

import type { Id } from "@convex/_generated/dataModel";
import { Anchor, Box, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

import type { AddOwnerFormValues } from "@/utils";

import AddOwnerForm from "../../owners/AddOwnerForm/AddOwnerForm";
import Heading from "../../ui/Heading/Heading";

interface AddOwnerPageProps {
  ownerId?: Id<"owners">;
  buildingId?: Id<"buildings">;
  initialValues?: AddOwnerFormValues;
  hasLogin?: boolean;
}

const AddOwnerPage: React.FC<AddOwnerPageProps> = ({
  ownerId,
  buildingId,
  initialValues,
  hasLogin,
}) => {
  const fromOwnersList = buildingId === undefined;

  return (
    <Box className="max-w-[800px]">
      <Box className={fromOwnersList ? "mb-8 sm:mb-10" : undefined}>
        {fromOwnersList ? (
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
        ) : null}
        <Heading
          variant="page"
          className={
            fromOwnersList
              ? "mb-0 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
              : "mb-6 text-[24px] font-bold text-darkGrey sm:mb-10 sm:text-[28px] md:text-[32px]"
          }
        >
          {ownerId === undefined ? "Add owner" : "Edit owner"}
        </Heading>
      </Box>
      <Box className="rounded-[8px] border border-border bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <AddOwnerForm
          key={ownerId ?? "new"}
          ownerId={ownerId}
          buildingId={buildingId}
          initialValues={initialValues}
          hasLogin={hasLogin}
        />
      </Box>
    </Box>
  );
};

export default AddOwnerPage;
