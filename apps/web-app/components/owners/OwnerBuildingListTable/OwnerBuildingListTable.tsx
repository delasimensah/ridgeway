"use client";

import { Box, Table } from "@mantine/core";
import React from "react";

import OwnerBuildingListRow from "../OwnerBuildingListRow/OwnerBuildingListRow";

export interface OwnerBuildingListItem {
  _id: string;
  name: string;
  address: string;
}

interface OwnerBuildingListTableProps {
  buildings: OwnerBuildingListItem[];
}

const TH =
  "px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-grey sm:px-6 sm:py-4";

const OwnerBuildingListTable: React.FC<OwnerBuildingListTableProps> = ({
  buildings,
}) => {
  return (
    <Box className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm">
      <Table.ScrollContainer minWidth={640} type="native">
        <Table highlightOnHover withRowBorders>
          <Table.Thead className="bg-sidebar">
            <Table.Tr>
              <Table.Th className={TH}>Name</Table.Th>
              <Table.Th className={TH}>Address</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {buildings.map((building) => (
              <OwnerBuildingListRow
                key={building._id}
                buildingId={building._id}
                name={building.name}
                address={building.address}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
};

export default OwnerBuildingListTable;
