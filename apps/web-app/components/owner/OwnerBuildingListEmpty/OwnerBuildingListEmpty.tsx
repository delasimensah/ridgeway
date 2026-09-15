"use client";

import React from "react";

import ListEmpty from "../../shared/ListEmpty/ListEmpty";

const OwnerBuildingListEmpty: React.FC = () => {
  return (
    <ListEmpty
      title="No buildings yet."
      description="When Ridgeway attaches a building to you, it will show here. You will not see another owner's buildings."
    />
  );
};

export default OwnerBuildingListEmpty;
