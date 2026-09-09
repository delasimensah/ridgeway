"use client";

import { SimpleGrid, Stack } from "@mantine/core";
import React from "react";

import OwnerBuildingCard from "../../owner/OwnerBuildingCard/OwnerBuildingCard";
import OwnerBuildingListEmpty from "../../owner/OwnerBuildingListEmpty/OwnerBuildingListEmpty";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface OwnerHomeBuilding {
  _id: string;
  name: string;
  address: string;
}

interface OwnerHomePageProps {
  greeting: string;
  buildings: OwnerHomeBuilding[];
}

const OwnerHomePage: React.FC<OwnerHomePageProps> = ({
  greeting,
  buildings,
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
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {buildings.map((building) => (
            <OwnerBuildingCard
              key={building._id}
              name={building.name}
              address={building.address}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};

export default OwnerHomePage;
