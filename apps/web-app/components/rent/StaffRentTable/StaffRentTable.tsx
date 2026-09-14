"use client";

import { Box, Table } from "@mantine/core";
import React from "react";
import type { Currency, RentConfirmedStatus } from "shared";

import StaffRentRow from "../StaffRentRow/StaffRentRow";

export interface StaffRentItem {
  _id: string;
  unitLabel: string;
  tenantName: string;
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
  confirmedAmount: number | null;
  tenantReportedAt: number | null;
  arrears: number;
}

interface StaffRentTableProps {
  periods: StaffRentItem[];
  serverNow: number;
  onSetStatus: (
    rentPeriodId: string,
    confirmedStatus: "paid" | "unpaid"
  ) => void;
  onRequestPartial: (rentPeriodId: string) => void;
}

const TH =
  "px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-grey sm:px-6 sm:py-4";

const StaffRentTable: React.FC<StaffRentTableProps> = ({
  periods,
  serverNow,
  onSetStatus,
  onRequestPartial,
}) => {
  return (
    <Box className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm">
      <Table.ScrollContainer minWidth={640} type="native">
        <Table highlightOnHover withRowBorders>
          <Table.Thead className="bg-sidebar">
            <Table.Tr>
              <Table.Th className={TH}>Unit</Table.Th>
              <Table.Th className={TH}>Tenant</Table.Th>
              <Table.Th className={TH}>Monthly rent</Table.Th>
              <Table.Th className={TH}>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {periods.map((period) => (
              <StaffRentRow
                key={period._id}
                unitLabel={period.unitLabel}
                tenantName={period.tenantName}
                amount={period.amount}
                currency={period.currency}
                dueOn={period.dueOn}
                confirmedStatus={period.confirmedStatus}
                confirmedAmount={period.confirmedAmount}
                tenantReportedAt={period.tenantReportedAt}
                arrears={period.arrears}
                serverNow={serverNow}
                onSetStatus={(confirmedStatus) =>
                  onSetStatus(period._id, confirmedStatus)
                }
                onRequestPartial={() => onRequestPartial(period._id)}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
};

export default StaffRentTable;
