"use client";

import { Box, Button, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";
import type { ScreenLoadState } from "shared";

import Heading from "../../ui/Heading/Heading";
import ListTableSkeleton from "../ListTableSkeleton/ListTableSkeleton";
import LoadFailed from "../LoadFailed/LoadFailed";

interface ListPageFrameProps {
  title: string;
  loadState?: ScreenLoadState;
  onRetry?: () => void;
  failedTitle: string;
  skeletonLabel: string;
  actionHref?: string;
  actionLabel?: string;
  isEmpty: boolean;
  empty: React.ReactNode;
  children: React.ReactNode;
}

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-primaryHover";
const PRIMARY_BUTTON_DISABLED =
  "h-auto cursor-not-allowed rounded-[8px] bg-primary px-6 py-2.5 text-[15px] font-semibold text-white opacity-50";

const ListPageFrame: React.FC<ListPageFrameProps> = ({
  title,
  loadState = "ready",
  onRetry,
  failedTitle,
  skeletonLabel,
  actionHref,
  actionLabel,
  isEmpty,
  empty,
  children,
}) => {
  const actionDisabled = loadState !== "ready";
  const hasAction = actionHref !== undefined && actionLabel !== undefined;

  return (
    <Box className="max-w-[1200px]">
      <Group
        justify="space-between"
        align="center"
        gap="md"
        wrap="wrap"
        className="mb-6 md:mb-8"
      >
        <Heading
          variant="page"
          className="mb-0 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
        >
          {title}
        </Heading>
        {hasAction && actionDisabled ? (
          <Button
            disabled
            className={`${PRIMARY_BUTTON_DISABLED} w-full sm:w-auto`}
          >
            {actionLabel}
          </Button>
        ) : null}
        {hasAction && !actionDisabled ? (
          <Button
            component={Link}
            href={actionHref}
            className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
          >
            {actionLabel}
          </Button>
        ) : null}
      </Group>
      {loadState === "loading" ? (
        <ListTableSkeleton label={skeletonLabel} />
      ) : null}
      {loadState === "failed" ? (
        <LoadFailed title={failedTitle} onRetry={onRetry} />
      ) : null}
      {loadState === "ready" && isEmpty ? empty : null}
      {loadState === "ready" && !isEmpty ? children : null}
    </Box>
  );
};

export default ListPageFrame;
