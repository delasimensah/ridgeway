"use client";

import { Box, Table } from "@mantine/core";
import React from "react";

import UnitListRow from "../UnitListRow/UnitListRow";

export interface UnitListItem {
  _id: string;
  label: string;
  tenantName?: string | null;
  leaseId?: string | null;
  leaseEndedOn?: string | null;
  rentAmount?: number | null;
  rentCurrency?: "GHS" | "USD" | null;
}

interface UnitListTableProps {
  buildingId: string;
  units: UnitListItem[];
}

const TH =
  "px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-grey sm:px-6 sm:py-4";

const UnitListTable: React.FC<UnitListTableProps> = ({ buildingId, units }) => {
  return (
    <Box className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm">
      <Table.ScrollContainer minWidth={640} type="native">
        <Table highlightOnHover withRowBorders>
          <Table.Thead className="bg-sidebar">
            <Table.Tr>
              <Table.Th className={TH}>Unit</Table.Th>
              <Table.Th className={TH}>Tenant</Table.Th>
              <Table.Th className={TH}>Rent</Table.Th>
              <Table.Th className={TH}>Lease ends</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {units.map((unit) => (
              <UnitListRow
                key={unit._id}
                buildingId={buildingId}
                unitId={unit._id}
                label={unit.label}
                tenantName={unit.tenantName}
                leaseId={unit.leaseId}
                leaseEndedOn={unit.leaseEndedOn}
                rentAmount={unit.rentAmount}
                rentCurrency={unit.rentCurrency}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
};

export default UnitListTable;
