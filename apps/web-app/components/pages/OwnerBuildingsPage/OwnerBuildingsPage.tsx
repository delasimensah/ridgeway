"use client";

import { SimpleGrid, Stack } from "@mantine/core";
import React from "react";

import OwnerBuildingCard from "../../owner/OwnerBuildingCard/OwnerBuildingCard";
import OwnerBuildingListEmpty from "../../owner/OwnerBuildingListEmpty/OwnerBuildingListEmpty";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";
import type { OwnerHomeBuilding } from "../OwnerHomePage/OwnerHomePage";

interface OwnerBuildingsPageProps {
  buildings: OwnerHomeBuilding[];
}

const OwnerBuildingsPage: React.FC<OwnerBuildingsPageProps> = ({
  buildings,
}) => {
  return (
    <Stack gap={0} className="max-w-[1200px]">
      <Heading
        variant="page"
        className="mb-1 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
      >
        Buildings
      </Heading>
      <Text className="mb-8 text-base text-grey md:mb-12">
        Your buildings with Ridgeway
      </Text>
      {buildings.length === 0 ? (
        <OwnerBuildingListEmpty />
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
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
      )}
    </Stack>
  );
};

export default OwnerBuildingsPage;
