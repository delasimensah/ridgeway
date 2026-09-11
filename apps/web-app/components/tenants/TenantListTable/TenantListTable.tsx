"use client";

import { Box, Table } from "@mantine/core";
import React from "react";

import TenantListRow from "../TenantListRow/TenantListRow";

export interface TenantListItem {
  _id: string;
  leaseId: string;
  buildingId: string;
  displayName: string;
  email: string;
  hasLogin: boolean;
  currentBuildingName: string | null;
  currentUnitLabel: string | null;
}

interface TenantListTableProps {
  tenants: TenantListItem[];
}

const TH =
  "px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-grey sm:px-6 sm:py-4";

const TenantListTable: React.FC<TenantListTableProps> = ({ tenants }) => {
  return (
    <Box className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm">
      <Table.ScrollContainer minWidth={640} type="native">
        <Table highlightOnHover withRowBorders>
          <Table.Thead className="bg-sidebar">
            <Table.Tr>
              <Table.Th className={TH}>Name</Table.Th>
              <Table.Th className={TH}>Email</Table.Th>
              <Table.Th className={TH}>Current unit</Table.Th>
              <Table.Th className={TH}>Can sign in</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tenants.map((tenant) => (
              <TenantListRow
                key={tenant._id}
                leaseId={tenant.leaseId}
                displayName={tenant.displayName}
                email={tenant.email}
                hasLogin={tenant.hasLogin}
                currentBuildingName={tenant.currentBuildingName}
                currentUnitLabel={tenant.currentUnitLabel}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
};

export default TenantListTable;
