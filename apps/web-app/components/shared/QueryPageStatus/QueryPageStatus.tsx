"use client";

import React from "react";
import type { ScreenLoadState } from "shared";

import LoadFailed from "../LoadFailed/LoadFailed";
import PageContentSkeleton from "../PageContentSkeleton/PageContentSkeleton";

interface QueryPageStatusProps {
  loadState: ScreenLoadState;
  onRetry?: () => void;
  failedTitle: string;
  children: React.ReactNode;
}

const QueryPageStatus: React.FC<QueryPageStatusProps> = ({
  loadState,
  onRetry,
  failedTitle,
  children,
}) => {
  if (loadState === "loading") {
    return <PageContentSkeleton />;
  }

  if (loadState === "failed") {
    return <LoadFailed title={failedTitle} onRetry={onRetry} />;
  }

  return <>{children}</>;
};

export default QueryPageStatus;
