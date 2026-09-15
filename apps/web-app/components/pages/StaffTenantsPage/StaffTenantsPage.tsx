"use client";

import React from "react";
import type { ScreenLoadState } from "shared";

import ListEmpty from "../../shared/ListEmpty/ListEmpty";
import ListPageFrame from "../../shared/ListPageFrame/ListPageFrame";
import TenantListTable, {
  type TenantListItem,
} from "../../tenants/TenantListTable/TenantListTable";

interface StaffTenantsPageProps {
  tenants: TenantListItem[];
  loadState?: ScreenLoadState;
  onRetry?: () => void;
}

const StaffTenantsPage: React.FC<StaffTenantsPageProps> = ({
  tenants,
  loadState = "ready",
  onRetry,
}) => {
  return (
    <ListPageFrame
      title="Tenants"
      loadState={loadState}
      onRetry={onRetry}
      failedTitle="Couldn't load tenants."
      skeletonLabel="Loading tenants"
      isEmpty={tenants.length === 0}
      empty={
        <ListEmpty
          title="No tenants yet."
          description="Add a tenant from a building when you put someone on a unit."
        />
      }
    >
      <TenantListTable tenants={tenants} />
    </ListPageFrame>
  );
};

export default StaffTenantsPage;
