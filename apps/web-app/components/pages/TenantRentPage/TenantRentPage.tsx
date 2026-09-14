"use client";

import { Anchor, Box } from "@mantine/core";
import Link from "next/link";
import React from "react";
import {
  type Currency,
  getRentDisplayStatus,
  type RentConfirmedStatus,
} from "shared";

import RentReportingNote from "../../rent/RentReportingNote/RentReportingNote";
import TenantRentHistoryRow from "../../rent/TenantRentHistoryRow/TenantRentHistoryRow";
import TenantRentInvoiceRow from "../../rent/TenantRentInvoiceRow/TenantRentInvoiceRow";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

export interface TenantRentPeriod {
  _id: string;
  periodLabel: string;
  amount: number;
  currency: Currency;
  dueOn: string;
  confirmedStatus: RentConfirmedStatus;
  tenantReportedAt: number | null;
}

interface TenantRentPageProps {
  buildingName: string;
  unitLabel: string;
  periods: TenantRentPeriod[];
  serverNow: number;
  reportingPeriodId?: string | null;
  onReport: (rentPeriodId: string) => void;
}

const TenantRentPage: React.FC<TenantRentPageProps> = ({
  buildingName,
  unitLabel,
  periods,
  serverNow,
  reportingPeriodId = null,
  onReport,
}) => {
  const open = periods.filter((period) => period.confirmedStatus !== "paid");
  const history = periods.filter((period) => period.confirmedStatus === "paid");

  return (
    <Box className="mx-auto w-full max-w-[800px] px-4 py-8 sm:px-6 sm:py-12">
      <Anchor
        component={Link}
        href="/"
        underline="never"
        className="mb-6 inline-flex text-sm font-medium text-grey hover:text-darkGrey"
      >
        Back to home
      </Anchor>
      <Heading
        variant="page"
        className="mb-10 text-[24px] font-bold text-darkGrey sm:text-[32px]"
      >
        Rent
      </Heading>
      <Box className="mb-8 flex items-center gap-4 rounded-[8px] bg-sidebar p-4">
        <Box>
          <Text className="text-[12px] font-bold uppercase tracking-wider text-grey">
            Unit
          </Text>
          <Text className="font-semibold text-darkGrey">
            {buildingName} · {unitLabel}
          </Text>
        </Box>
      </Box>
      <Box component="section" className="space-y-4">
        <Heading
          variant="section"
          className="mb-4 text-[14px] font-bold uppercase tracking-wider text-grey"
        >
          Invoices
        </Heading>
        {open.length === 0 ? (
          <Text className="text-base text-grey">No open rent.</Text>
        ) : (
          open.map((period) => (
            <TenantRentInvoiceRow
              key={period._id}
              periodLabel={period.periodLabel}
              amount={period.amount}
              currency={period.currency}
              dueOn={period.dueOn}
              confirmedStatus={period.confirmedStatus}
              tenantReportedAt={period.tenantReportedAt}
              serverNow={serverNow}
              isReporting={reportingPeriodId === period._id}
              onReport={() => onReport(period._id)}
            />
          ))
        )}
        <RentReportingNote />
      </Box>
      {history.length > 0 ? (
        <Box component="section" className="mt-12">
          <Heading
            variant="section"
            className="mb-4 text-[14px] font-bold uppercase tracking-wider text-grey"
          >
            Recent history
          </Heading>
          <Box className="border-t border-border">
            {history.map((period) => (
              <TenantRentHistoryRow
                key={period._id}
                periodLabel={period.periodLabel}
                amount={period.amount}
                currency={period.currency}
                status={getRentDisplayStatus(period, serverNow)}
              />
            ))}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default TenantRentPage;
