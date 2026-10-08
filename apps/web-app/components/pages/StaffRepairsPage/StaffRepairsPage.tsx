"use client";

import React from "react";
import type { ScreenLoadState } from "shared";

import RepairListTable, {
  type RepairListItem,
} from "../../repairs/RepairListTable/RepairListTable";
import ListEmpty from "../../shared/ListEmpty/ListEmpty";
import ListPageFrame from "../../shared/ListPageFrame/ListPageFrame";

interface StaffRepairsPageProps {
  repairs: RepairListItem[];
  loadState?: ScreenLoadState;
  onRetry?: () => void;
}

const StaffRepairsPage: React.FC<StaffRepairsPageProps> = ({
  repairs,
  loadState = "ready",
  onRetry,
}) => {
  return (
    <ListPageFrame
      title="Repairs"
      loadState={loadState}
      onRetry={onRetry}
      failedTitle="Couldn't load repairs."
      skeletonLabel="Loading repairs"
      isEmpty={repairs.length === 0}
      empty={
        <ListEmpty
          title="Nothing open right now."
          description="When a tenant files a ticket, it will show here."
        />
      }
    >
      <RepairListTable repairs={repairs} />
    </ListPageFrame>
  );
};

export default StaffRepairsPage;
