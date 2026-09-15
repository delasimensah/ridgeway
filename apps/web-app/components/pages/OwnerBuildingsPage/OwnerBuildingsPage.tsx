"use client";

import { SimpleGrid, Stack } from "@mantine/core";
import React from "react";
import type { ScreenLoadState } from "shared";

import OwnerBuildingCard from "../../owner/OwnerBuildingCard/OwnerBuildingCard";
import OwnerBuildingListEmpty from "../../owner/OwnerBuildingListEmpty/OwnerBuildingListEmpty";
import ListTableSkeleton from "../../shared/ListTableSkeleton/ListTableSkeleton";
import LoadFailed from "../../shared/LoadFailed/LoadFailed";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";
import type { OwnerHomeBuilding } from "../OwnerHomePage/OwnerHomePage";

interface OwnerBuildingsPageProps {
  buildings: OwnerHomeBuilding[];
  loadState?: ScreenLoadState;
  onRetry?: () => void;
}

const OwnerBuildingsPage: React.FC<OwnerBuildingsPageProps> = ({
  buildings,
  loadState = "ready",
  onRetry,
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
      {loadState === "loading" ? (
        <ListTableSkeleton label="Loading buildings" />
      ) : null}
      {loadState === "failed" ? (
        <LoadFailed title="Couldn't load buildings." onRetry={onRetry} />
      ) : null}
      {loadState === "ready" && buildings.length === 0 ? (
        <OwnerBuildingListEmpty />
      ) : null}
      {loadState === "ready" && buildings.length > 0 ? (
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
      ) : null}
    </Stack>
  );
};

export default OwnerBuildingsPage;
