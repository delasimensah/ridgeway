"use client";

import { SimpleGrid, Stack } from "@mantine/core";
import React from "react";
import type { Currency } from "shared";

import OwnerBuildingCard from "../../owner/OwnerBuildingCard/OwnerBuildingCard";
import OwnerBuildingListEmpty from "../../owner/OwnerBuildingListEmpty/OwnerBuildingListEmpty";
import OwnerPortfolioStatus from "../../owner/OwnerPortfolioStatus/OwnerPortfolioStatus";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

export interface OwnerHomeBuilding {
  _id: string;
  name: string;
  address: string;
  occupiedCount: number;
  unitCount: number;
  openRepairCount: number;
  collected: number;
  outstanding: number;
  currency: Currency;
}

interface OwnerHomePageProps {
  greeting: string;
  buildings: OwnerHomeBuilding[];
  collected: number;
  outstanding: number;
  currency: Currency;
}

const OwnerHomePage: React.FC<OwnerHomePageProps> = ({
  greeting,
  buildings,
  collected,
  outstanding,
  currency,
}) => {
  return (
    <Stack gap={0} className="max-w-[1200px]">
      <Heading
        variant="page"
        className="mb-1 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
      >
        {greeting}
      </Heading>
      <Text className="mb-8 text-base text-grey md:mb-12">
        Your buildings with Ridgeway
      </Text>
      {buildings.length === 0 ? (
        <OwnerBuildingListEmpty />
      ) : (
        <>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing="md"
            className="mb-8 md:mb-12"
          >
            {buildings.map((building) => (
              <OwnerBuildingCard
                key={building._id}
                href={`/buildings/${building._id}`}
                name={building.name}
                address={building.address}
                occupiedCount={building.occupiedCount}
                unitCount={building.unitCount}
                openRepairCount={building.openRepairCount}
                collected={building.collected}
                outstanding={building.outstanding}
                currency={building.currency}
              />
            ))}
          </SimpleGrid>
          <OwnerPortfolioStatus
            collected={collected}
            outstanding={outstanding}
            currency={currency}
            buildingCount={buildings.length}
          />
        </>
      )}
    </Stack>
  );
};

export default OwnerHomePage;
