"use client";

import { Box } from "@mantine/core";
import React from "react";

import OwnerListTable, {
  type OwnerListItem,
} from "../../owners/OwnerListTable/OwnerListTable";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffOwnersPageProps {
  owners: OwnerListItem[];
}

const StaffOwnersPage: React.FC<StaffOwnersPageProps> = ({ owners }) => {
  return (
    <Box className="max-w-[1200px]">
      <Heading
        variant="page"
        className="mb-6 text-[24px] font-bold text-darkGrey sm:mb-8 sm:text-[28px] md:text-[32px]"
      >
        Owners
      </Heading>
      {owners.length === 0 ? (
        <Text className="text-base text-grey">No owners yet.</Text>
      ) : (
        <OwnerListTable owners={owners} />
      )}
    </Box>
  );
};

export default StaffOwnersPage;
