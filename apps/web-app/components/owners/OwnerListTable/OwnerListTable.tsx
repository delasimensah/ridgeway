"use client";

import { Box, Table } from "@mantine/core";
import React from "react";

import OwnerListRow from "../OwnerListRow/OwnerListRow";

export interface OwnerListItem {
  _id: string;
  displayName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  hasLogin: boolean;
  buildingCount: number;
}

interface OwnerListTableProps {
  owners: OwnerListItem[];
}

const TH =
  "px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-grey sm:px-6 sm:py-4";

const OwnerListTable: React.FC<OwnerListTableProps> = ({ owners }) => {
  return (
    <Box className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm">
      <Table.ScrollContainer minWidth={640} type="native">
        <Table highlightOnHover withRowBorders>
          <Table.Thead className="bg-sidebar">
            <Table.Tr>
              <Table.Th className={TH}>Name</Table.Th>
              <Table.Th className={TH}>Email</Table.Th>
              <Table.Th className={TH}>Buildings</Table.Th>
              <Table.Th className={TH}>Can sign in</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {owners.map((owner) => (
              <OwnerListRow
                key={owner._id}
                ownerId={owner._id}
                displayName={owner.displayName}
                contactEmail={owner.contactEmail}
                hasLogin={owner.hasLogin}
                buildingCount={owner.buildingCount}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
};

export default OwnerListTable;
