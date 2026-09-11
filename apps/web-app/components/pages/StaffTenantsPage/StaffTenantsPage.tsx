"use client";

import { Box } from "@mantine/core";
import React from "react";

import TenantListTable, {
  type TenantListItem,
} from "../../tenants/TenantListTable/TenantListTable";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffTenantsPageProps {
  tenants: TenantListItem[];
}

const StaffTenantsPage: React.FC<StaffTenantsPageProps> = ({ tenants }) => {
  return (
    <Box className="max-w-[1200px]">
      <Heading
        variant="page"
        className="mb-6 text-[24px] font-bold text-darkGrey sm:mb-8 sm:text-[28px] md:text-[32px]"
      >
        Tenants
      </Heading>
      {tenants.length === 0 ? (
        <Text className="text-base text-grey">No tenants yet.</Text>
      ) : (
        <TenantListTable tenants={tenants} />
      )}
    </Box>
  );
};

export default StaffTenantsPage;
