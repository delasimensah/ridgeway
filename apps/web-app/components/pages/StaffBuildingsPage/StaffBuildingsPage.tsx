"use client";

import React from "react";
import type { ScreenLoadState } from "shared";

import BuildingListEmpty from "../../buildings/BuildingListEmpty/BuildingListEmpty";
import BuildingListTable, {
  type BuildingListItem,
} from "../../buildings/BuildingListTable/BuildingListTable";
import ListPageFrame from "../../shared/ListPageFrame/ListPageFrame";

interface StaffBuildingsPageProps {
  buildings: BuildingListItem[];
  loadState?: ScreenLoadState;
  onRetry?: () => void;
}

const StaffBuildingsPage: React.FC<StaffBuildingsPageProps> = ({
  buildings,
  loadState = "ready",
  onRetry,
}) => {
  return (
    <ListPageFrame
      title="Buildings"
      loadState={loadState}
      onRetry={onRetry}
      failedTitle="Couldn't load buildings."
      skeletonLabel="Loading buildings"
      actionHref="/buildings/new"
      actionLabel="Add building"
      isEmpty={buildings.length === 0}
      empty={<BuildingListEmpty />}
    >
      <BuildingListTable buildings={buildings} />
    </ListPageFrame>
  );
};

export default StaffBuildingsPage;
