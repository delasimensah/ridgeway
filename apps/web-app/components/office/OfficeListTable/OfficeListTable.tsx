"use client";

import { Box, Table } from "@mantine/core";
import React from "react";

import OfficeListRow from "../OfficeListRow/OfficeListRow";

export interface OfficeListItem {
  _id: string;
  displayName: string;
  email: string | null;
  hasLogin: boolean;
}

interface OfficeListTableProps {
  people: OfficeListItem[];
}

const TH =
  "px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-grey sm:px-6 sm:py-4";

const OfficeListTable: React.FC<OfficeListTableProps> = ({ people }) => {
  return (
    <Box className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm">
      <Table.ScrollContainer minWidth={640} type="native">
        <Table highlightOnHover withRowBorders>
          <Table.Thead className="bg-sidebar">
            <Table.Tr>
              <Table.Th className={TH}>Name</Table.Th>
              <Table.Th className={TH}>Email</Table.Th>
              <Table.Th className={TH}>Can sign in</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {people.map((person) => (
              <OfficeListRow
                key={person._id}
                profileId={person._id}
                displayName={person.displayName}
                email={person.email}
                hasLogin={person.hasLogin}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
};

export default OfficeListTable;
