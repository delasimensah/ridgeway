"use client";

import { Box } from "@mantine/core";
import React from "react";

import AddBuildingForm from "../../buildings/AddBuildingForm/AddBuildingForm";
import Heading from "../../ui/Heading/Heading";

const AddBuildingPage: React.FC = () => {
  return (
    <Box className="max-w-[800px]">
      <Heading
        variant="page"
        className="mb-6 text-[24px] font-bold text-darkGrey sm:mb-10 sm:text-[28px] md:text-[32px]"
      >
        Add building
      </Heading>
      <Box className="rounded-[8px] border border-border bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <AddBuildingForm />
      </Box>
    </Box>
  );
};

export default AddBuildingPage;
