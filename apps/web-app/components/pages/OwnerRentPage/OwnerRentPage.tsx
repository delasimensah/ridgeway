"use client";

import { Stack } from "@mantine/core";
import React from "react";
import type { Currency } from "shared";

import OwnerRentBreakdownTable, {
  type OwnerRentBuildingRow,
} from "../../owner/OwnerRentBreakdownTable/OwnerRentBreakdownTable";
import OwnerRentTotals from "../../owner/OwnerRentTotals/OwnerRentTotals";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface OwnerRentPageProps {
  collected: number;
  outstanding: number;
  currency: Currency;
  buildings: OwnerRentBuildingRow[];
}

const OwnerRentPage: React.FC<OwnerRentPageProps> = ({
  collected,
  outstanding,
  currency,
  buildings,
}) => {
  return (
    <Stack gap={0} className="max-w-[1200px]">
      <Heading
        variant="page"
        className="mb-1 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
      >
        Rent
      </Heading>
      <Text className="mb-8 text-base text-grey md:mb-12">
        Portfolio collection summary for this month
      </Text>
      <OwnerRentTotals
        collected={collected}
        outstanding={outstanding}
        currency={currency}
      />
      <Heading
        variant="section"
        className="mb-6 mt-8 text-[20px] font-bold text-darkGrey md:mt-12"
      >
        Building Breakdown
      </Heading>
      {buildings.length === 0 ? (
        <Text className="text-base text-grey">
          No buildings are attached to you yet.
        </Text>
      ) : (
        <OwnerRentBreakdownTable
          buildings={buildings}
          collected={collected}
          outstanding={outstanding}
          currency={currency}
        />
      )}
    </Stack>
  );
};

export default OwnerRentPage;
