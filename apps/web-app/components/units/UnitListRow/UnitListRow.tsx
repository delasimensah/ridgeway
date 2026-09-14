"use client";

import { Anchor, Table } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { type Currency, formatDateString, formatMoney } from "shared";

interface UnitListRowProps {
  buildingId: string;
  unitId: string;
  label: string;
  tenantName?: string | null;
  leaseId?: string | null;
  leaseEndedOn?: string | null;
  rentAmount?: number | null;
  rentCurrency?: Currency | null;
}

const TD = "px-4 py-4 text-[15px] text-darkGrey sm:px-6 sm:py-5";
const LABEL_TD = "px-4 py-4 font-bold text-darkGrey sm:px-6 sm:py-5";

const UnitListRow: React.FC<UnitListRowProps> = ({
  buildingId,
  unitId,
  label,
  tenantName = null,
  leaseId = null,
  leaseEndedOn = null,
  rentAmount = null,
  rentCurrency = null,
}) => {
  return (
    <Table.Tr className="hover:bg-sidebar">
      <Table.Td className={LABEL_TD}>
        <Anchor
          component={Link}
          href={`/buildings/${buildingId}/units/${unitId}/edit`}
          underline="never"
          className="font-bold text-darkGrey"
        >
          {label}
        </Anchor>
      </Table.Td>
      <Table.Td className={TD}>
        {tenantName !== null && leaseId !== null ? (
          <Anchor
            component={Link}
            href={`/buildings/${buildingId}/tenants/${leaseId}/edit`}
            underline="never"
            className="text-darkGrey"
          >
            {tenantName}
          </Anchor>
        ) : (
          "—"
        )}
      </Table.Td>
      <Table.Td className={TD}>
        {rentAmount !== null && rentCurrency !== null
          ? formatMoney(rentAmount, rentCurrency)
          : "—"}
      </Table.Td>
      <Table.Td className={TD}>
        {leaseEndedOn !== null
          ? formatDateString(leaseEndedOn, "d MMM yyyy")
          : "—"}
      </Table.Td>
    </Table.Tr>
  );
};

export default UnitListRow;
