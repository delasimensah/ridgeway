"use client";

import { Box, Table } from "@mantine/core";
import React from "react";
import { cn, type Currency, formatMoney } from "shared";

export interface OwnerRentBuildingRow {
  buildingId: string;
  name: string;
  address: string;
  collected: number;
  outstanding: number;
}

interface OwnerRentBreakdownTableProps {
  buildings: OwnerRentBuildingRow[];
  collected: number;
  outstanding: number;
  currency: Currency;
}

const TH =
  "px-4 py-4 text-[12px] font-bold uppercase tracking-wider text-grey sm:px-8";
const TD = "px-4 py-6 sm:px-8";

const OwnerRentBreakdownTable: React.FC<OwnerRentBreakdownTableProps> = ({
  buildings,
  collected,
  outstanding,
  currency,
}) => {
  return (
    <Box className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm">
      <Table.ScrollContainer minWidth={640} type="native">
        <Table withRowBorders>
          <Table.Thead className="bg-sidebar">
            <Table.Tr>
              <Table.Th className={TH}>Building</Table.Th>
              <Table.Th className={TH}>Address</Table.Th>
              <Table.Th className={TH}>Collected</Table.Th>
              <Table.Th className={`${TH} text-right`}>Outstanding</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {buildings.map((building) => (
              <Table.Tr key={building.buildingId}>
                <Table.Td
                  className={`${TD} text-[16px] font-bold text-darkGrey`}
                >
                  {building.name}
                </Table.Td>
                <Table.Td className={`${TD} text-sm text-grey`}>
                  {building.address}
                </Table.Td>
                <Table.Td
                  className={`${TD} text-[16px] font-bold text-darkGrey`}
                >
                  {formatMoney(building.collected, currency)}
                </Table.Td>
                <Table.Td
                  className={cn(
                    `${TD} text-right text-[16px] font-bold`,
                    building.outstanding > 0
                      ? "text-accentInk"
                      : "text-darkGrey"
                  )}
                >
                  {formatMoney(building.outstanding, currency)}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
          <Table.Tfoot className="bg-sidebar font-bold">
            <Table.Tr>
              <Table.Td className={TD} colSpan={2}>
                Total Portfolio
              </Table.Td>
              <Table.Td className={`${TD} text-[18px] text-darkGrey`}>
                {formatMoney(collected, currency)}
              </Table.Td>
              <Table.Td
                className={cn(
                  `${TD} text-right text-[18px]`,
                  outstanding > 0 ? "text-accentInk" : "text-darkGrey"
                )}
              >
                {formatMoney(outstanding, currency)}
              </Table.Td>
            </Table.Tr>
          </Table.Tfoot>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
};

export default OwnerRentBreakdownTable;
