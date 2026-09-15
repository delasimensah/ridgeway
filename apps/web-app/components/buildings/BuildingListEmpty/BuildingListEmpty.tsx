"use client";

import React from "react";

import ListEmpty from "../../shared/ListEmpty/ListEmpty";

const BuildingListEmpty: React.FC = () => {
  return (
    <ListEmpty
      title="No buildings yet."
      description="Get started by adding your first property to manage repairs and collect rent."
      actionHref="/buildings/new"
      actionLabel="Add building"
    />
  );
};

export default BuildingListEmpty;
