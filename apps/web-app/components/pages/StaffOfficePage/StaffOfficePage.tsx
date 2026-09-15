"use client";

import React from "react";
import type { ScreenLoadState } from "shared";

import OfficeListTable, {
  type OfficeListItem,
} from "../../office/OfficeListTable/OfficeListTable";
import ListEmpty from "../../shared/ListEmpty/ListEmpty";
import ListPageFrame from "../../shared/ListPageFrame/ListPageFrame";

interface StaffOfficePageProps {
  people: OfficeListItem[];
  loadState?: ScreenLoadState;
  onRetry?: () => void;
}

const StaffOfficePage: React.FC<StaffOfficePageProps> = ({
  people,
  loadState = "ready",
  onRetry,
}) => {
  return (
    <ListPageFrame
      title="Staff"
      loadState={loadState}
      onRetry={onRetry}
      failedTitle="Couldn't load staff."
      skeletonLabel="Loading staff"
      actionHref="/office/new"
      actionLabel="Add office person"
      isEmpty={people.length === 0}
      empty={
        <ListEmpty
          title="No office people yet."
          description="Add another office person so they can sign in on the website."
          actionHref="/office/new"
          actionLabel="Add office person"
        />
      }
    >
      <OfficeListTable people={people} />
    </ListPageFrame>
  );
};

export default StaffOfficePage;
