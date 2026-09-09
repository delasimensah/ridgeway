"use client";

import { Box, Table } from "@mantine/core";
import React from "react";

import BuildingListRow from "../BuildingListRow/BuildingListRow";

export interface BuildingListItem {
  _id: string;
  name: string;
  address: string;
  ownerName: string | null;
  unitCount: number;
}

interface BuildingListTableProps {
  buildings: BuildingListItem[];
}

const TH =
  "px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-grey sm:px-6 sm:py-4";

const BuildingListTable: React.FC<BuildingListTableProps> = ({ buildings }) => {
  return (
    <Box className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm">
      <Table.ScrollContainer minWidth={640} type="native">
        <Table highlightOnHover withRowBorders>
          <Table.Thead className="bg-sidebar">
            <Table.Tr>
              <Table.Th className={TH}>Name</Table.Th>
              <Table.Th className={TH}>Address</Table.Th>
              <Table.Th className={TH}>Owner</Table.Th>
              <Table.Th className={TH}>Units</Table.Th>
              <Table.Th className={TH}>Open repairs</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {buildings.map((building) => (
              <BuildingListRow
                key={building._id}
                buildingId={building._id}
                name={building.name}
                address={building.address}
                ownerLabel={building.ownerName ?? "—"}
                unitCount={building.unitCount}
                openRepairCount={0}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
};

export default BuildingListTable;
