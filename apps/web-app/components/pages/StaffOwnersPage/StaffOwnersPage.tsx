"use client";

import React from "react";
import type { ScreenLoadState } from "shared";

import OwnerListTable, {
  type OwnerListItem,
} from "../../owners/OwnerListTable/OwnerListTable";
import ListEmpty from "../../shared/ListEmpty/ListEmpty";
import ListPageFrame from "../../shared/ListPageFrame/ListPageFrame";

interface StaffOwnersPageProps {
  owners: OwnerListItem[];
  loadState?: ScreenLoadState;
  onRetry?: () => void;
}

const StaffOwnersPage: React.FC<StaffOwnersPageProps> = ({
  owners,
  loadState = "ready",
  onRetry,
}) => {
  return (
    <ListPageFrame
      title="Owners"
      loadState={loadState}
      onRetry={onRetry}
      failedTitle="Couldn't load owners."
      skeletonLabel="Loading owners"
      isEmpty={owners.length === 0}
      empty={
        <ListEmpty
          title="No owners yet."
          description="Add an owner when you add a building, or from a building you already saved."
        />
      }
    >
      <OwnerListTable owners={owners} />
    </ListPageFrame>
  );
};

export default StaffOwnersPage;
