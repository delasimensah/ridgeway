"use client";

import { Anchor, Box, Table } from "@mantine/core";
import Link from "next/link";
import React from "react";
import type { WorkOrderStatus } from "shared";

import RepairStatusBadge from "../RepairStatusBadge/RepairStatusBadge";

export interface RepairListItem {
  _id: string;
  title: string;
  status: WorkOrderStatus;
  unitLabel: string;
  buildingName: string;
  assigneeName?: string | null;
}

interface RepairListTableProps {
  repairs: RepairListItem[];
  showAssignee?: boolean;
}

const TH =
  "px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-grey sm:px-6 sm:py-4";
const TD = "px-4 py-4 text-[15px] text-darkGrey sm:px-6 sm:py-5";

const RepairListTable: React.FC<RepairListTableProps> = ({
  repairs,
  showAssignee = true,
}) => {
  return (
    <Box className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm">
      <Table.ScrollContainer minWidth={showAssignee ? 720 : 640} type="native">
        <Table highlightOnHover withRowBorders>
          <Table.Thead className="bg-sidebar">
            <Table.Tr>
              <Table.Th className={TH}>Title</Table.Th>
              <Table.Th className={TH}>Building</Table.Th>
              <Table.Th className={TH}>Unit</Table.Th>
              <Table.Th className={TH}>Status</Table.Th>
              {showAssignee ? (
                <Table.Th className={TH}>Assigned to</Table.Th>
              ) : null}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {repairs.map((repair) => (
              <Table.Tr key={repair._id} className="hover:bg-sidebar">
                <Table.Td className={`${TD} font-bold`}>
                  <Anchor
                    component={Link}
                    href={`/repairs/${repair._id}`}
                    underline="never"
                    className="font-bold text-darkGrey"
                  >
                    {repair.title}
                  </Anchor>
                </Table.Td>
                <Table.Td className={TD}>{repair.buildingName}</Table.Td>
                <Table.Td className={TD}>{repair.unitLabel}</Table.Td>
                <Table.Td className={TD}>
                  <RepairStatusBadge status={repair.status} />
                </Table.Td>
                {showAssignee ? (
                  <Table.Td className={TD}>
                    {repair.assigneeName ?? "—"}
                  </Table.Td>
                ) : null}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
};

export default RepairListTable;
