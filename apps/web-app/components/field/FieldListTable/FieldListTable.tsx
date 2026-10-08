"use client";

import { Box, Table } from "@mantine/core";
import React from "react";

import FieldListRow from "../FieldListRow/FieldListRow";

export interface FieldListItem {
  _id: string;
  displayName: string;
  email: string | null;
  hasLogin: boolean;
}

interface FieldListTableProps {
  people: FieldListItem[];
}

const TH =
  "px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-grey sm:px-6 sm:py-4";

const FieldListTable: React.FC<FieldListTableProps> = ({ people }) => {
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
              <FieldListRow
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

export default FieldListTable;
