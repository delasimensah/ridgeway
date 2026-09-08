"use client";

import type { Id } from "@convex/_generated/dataModel";
import { Box } from "@mantine/core";
import React from "react";

import type { AddUnitFormValues } from "@/utils";

import Heading from "../../ui/Heading/Heading";
import AddUnitForm from "../../units/AddUnitForm/AddUnitForm";

interface AddUnitPageProps {
  buildingId: Id<"buildings">;
  buildingName: string;
  unitId?: Id<"units">;
  initialValues?: AddUnitFormValues;
}

const AddUnitPage: React.FC<AddUnitPageProps> = ({
  buildingId,
  buildingName,
  unitId,
  initialValues,
}) => {
  return (
    <Box className="max-w-[800px]">
      <Heading
        variant="page"
        className="mb-6 text-[24px] font-bold text-darkGrey sm:mb-10 sm:text-[28px] md:text-[32px]"
      >
        Add unit
      </Heading>
      <Box className="rounded-[8px] border border-border bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <AddUnitForm
          buildingId={buildingId}
          buildingName={buildingName}
          unitId={unitId}
          initialValues={initialValues}
        />
      </Box>
    </Box>
  );
};

export default AddUnitPage;
