"use client";

import React from "react";

import ListEmpty from "../../shared/ListEmpty/ListEmpty";

interface UnitListEmptyProps {
  buildingId: string;
}

const UnitListEmpty: React.FC<UnitListEmptyProps> = ({ buildingId }) => {
  return (
    <ListEmpty
      title="No units yet."
      description="Add a unit label under this building, for example A3."
      actionHref={`/buildings/${buildingId}/units/new`}
      actionLabel="Add unit"
    />
  );
};

export default UnitListEmpty;
