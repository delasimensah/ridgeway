"use client";

import React from "react";
import type { ScreenLoadState } from "shared";

import FieldListTable, {
  type FieldListItem,
} from "../../field/FieldListTable/FieldListTable";
import ListEmpty from "../../shared/ListEmpty/ListEmpty";
import ListPageFrame from "../../shared/ListPageFrame/ListPageFrame";

interface StaffFieldPageProps {
  people: FieldListItem[];
  loadState?: ScreenLoadState;
  onRetry?: () => void;
}

const StaffFieldPage: React.FC<StaffFieldPageProps> = ({
  people,
  loadState = "ready",
  onRetry,
}) => {
  return (
    <ListPageFrame
      title="Field workers"
      loadState={loadState}
      onRetry={onRetry}
      failedTitle="Couldn't load field workers."
      skeletonLabel="Loading field workers"
      actionHref="/field/new"
      actionLabel="Add field worker"
      isEmpty={people.length === 0}
      empty={
        <ListEmpty
          title="No field workers yet."
          description="Add a caretaker so they can update jobs on the phone."
          actionHref="/field/new"
          actionLabel="Add field worker"
        />
      }
    >
      <FieldListTable people={people} />
    </ListPageFrame>
  );
};

export default StaffFieldPage;
