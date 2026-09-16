import React from "react";
import type { ScreenLoadState } from "shared";

import LoadFailed from "../LoadFailed/LoadFailed";
import PageContentSkeleton from "../PageContentSkeleton/PageContentSkeleton";

interface QueryPageStatusProps {
  loadState: ScreenLoadState;
  onRetry?: () => void;
  failedTitle: string;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}

const QueryPageStatus: React.FC<QueryPageStatusProps> = ({
  loadState,
  onRetry,
  failedTitle,
  children,
  skeleton,
}) => {
  if (loadState === "loading") {
    return skeleton ?? <PageContentSkeleton />;
  }

  if (loadState === "failed") {
    return (
      <LoadFailed
        message={failedTitle}
        onRetry={onRetry ?? (() => undefined)}
      />
    );
  }

  return <>{children}</>;
};

export default QueryPageStatus;
