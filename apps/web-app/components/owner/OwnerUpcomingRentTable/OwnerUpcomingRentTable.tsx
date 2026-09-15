"use client";

import { Box, Table } from "@mantine/core";
import React from "react";
import { cn, type Currency, formatMoney } from "shared";

import Text from "../../ui/Text/Text";

export interface OwnerUpcomingRentItem {
  _id: string;
  unitLabel: string;
  tenantName: string;
  amount: number;
  currency: Currency;
  confirmedStatus: "unpaid" | "partial" | "paid";
}

interface OwnerUpcomingRentTableProps {
  periods: OwnerUpcomingRentItem[];
}

const TH =
  "px-4 py-4 text-[12px] font-bold uppercase tracking-wider text-grey sm:px-6";
const TD = "px-4 py-4 text-[14px] sm:px-6";

const OwnerUpcomingRentTable: React.FC<OwnerUpcomingRentTableProps> = ({
  periods,
}) => {
  return (
    <Box className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm">
      <Table.ScrollContainer minWidth={640} type="native">
        <Table withRowBorders>
          <Table.Thead className="bg-sidebar">
            <Table.Tr>
              <Table.Th className={TH}>Unit</Table.Th>
              <Table.Th className={TH}>Tenant</Table.Th>
              <Table.Th className={TH}>Amount</Table.Th>
              <Table.Th className={`${TH} text-right`}>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {periods.map((period) => {
              const isCollected = period.confirmedStatus === "paid";
              return (
                <Table.Tr key={period._id}>
                  <Table.Td className={`${TD} font-medium text-darkGrey`}>
                    {period.unitLabel}
                  </Table.Td>
                  <Table.Td className={`${TD} text-grey`}>
                    {period.tenantName}
                  </Table.Td>
                  <Table.Td className={`${TD} font-bold text-darkGrey`}>
                    {formatMoney(period.amount, period.currency)}
                  </Table.Td>
                  <Table.Td className={`${TD} text-right`}>
                    <Text
                      className={cn(
                        "text-[12px] font-bold uppercase",
                        isCollected ? "text-darkGrey" : "text-accent"
                      )}
                    >
                      {isCollected ? "Collected" : "Outstanding"}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
};

export default OwnerUpcomingRentTable;
