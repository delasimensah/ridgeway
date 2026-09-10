"use client";

import type { Id } from "@convex/_generated/dataModel";
import { Box } from "@mantine/core";
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
  return (
    <Box className="max-w-[800px]">
      <Heading
        variant="page"
        className="mb-6 text-[24px] font-bold text-darkGrey sm:mb-10 sm:text-[28px] md:text-[32px]"
      >
        {ownerId === undefined ? "Add owner" : "Edit owner"}
      </Heading>
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
