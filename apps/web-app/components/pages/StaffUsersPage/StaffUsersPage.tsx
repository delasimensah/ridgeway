"use client";

import { Box, Button, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";
import type { ScreenLoadState } from "shared";

import { useWritesLocked } from "@/hooks";

import FieldListTable, {
  type FieldListItem,
} from "../../field/FieldListTable/FieldListTable";
import OfficeListTable, {
  type OfficeListItem,
} from "../../office/OfficeListTable/OfficeListTable";
import OwnerListTable, {
  type OwnerListItem,
} from "../../owners/OwnerListTable/OwnerListTable";
import ListTableSkeleton from "../../shared/ListTableSkeleton/ListTableSkeleton";
import LoadFailed from "../../shared/LoadFailed/LoadFailed";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffUsersPageProps {
  owners: OwnerListItem[];
  ownersLoadState?: ScreenLoadState;
  staff: OfficeListItem[];
  staffLoadState?: ScreenLoadState;
  fieldWorkers: FieldListItem[];
  fieldLoadState?: ScreenLoadState;
  onRetry?: () => void;
}

const ADD_BUTTON =
  "h-auto rounded-[8px] bg-primary px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-primaryHover";
const ADD_BUTTON_DISABLED =
  "h-auto cursor-not-allowed rounded-[8px] bg-primary px-6 py-2.5 text-[15px] font-semibold text-white opacity-50";

const StaffUsersPage: React.FC<StaffUsersPageProps> = ({
  owners,
  ownersLoadState = "ready",
  staff,
  staffLoadState = "ready",
  fieldWorkers,
  fieldLoadState = "ready",
  onRetry,
}) => {
  return (
    <Box className="max-w-[1200px]">
      <Heading
        variant="page"
        className="mb-2 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
      >
        Users
      </Heading>
      <Text className="mb-10 text-base text-grey">
        Owners, office staff, and field workers.
      </Text>
      <UserSection
        title="Owners"
        description="People who own a building."
        loadState={ownersLoadState}
        failedTitle="Couldn't load owners."
        skeletonLabel="Loading owners"
        onRetry={onRetry}
        isEmpty={owners.length === 0}
        emptyTitle="No owners yet."
        emptyDescription="Add an owner when you add a building, or from a building you already saved."
      >
        <OwnerListTable owners={owners} />
      </UserSection>
      <UserSection
        title="Staff"
        description="People who sign in on this website."
        loadState={staffLoadState}
        failedTitle="Couldn't load staff."
        skeletonLabel="Loading staff"
        onRetry={onRetry}
        isEmpty={staff.length === 0}
        emptyTitle="No office people yet."
        emptyDescription="Add another office person so they can sign in on the website."
        actionHref="/office/new"
        actionLabel="Add office person"
      >
        <OfficeListTable people={staff} />
      </UserSection>
      <UserSection
        title="Field workers"
        description="People who update jobs on the phone."
        loadState={fieldLoadState}
        failedTitle="Couldn't load field workers."
        skeletonLabel="Loading field workers"
        onRetry={onRetry}
        isEmpty={fieldWorkers.length === 0}
        emptyTitle="No field workers yet."
        emptyDescription="Add a caretaker so they can update jobs on the phone."
        actionHref="/field/new"
        actionLabel="Add field worker"
      >
        <FieldListTable people={fieldWorkers} />
      </UserSection>
    </Box>
  );
};

interface UserSectionProps {
  title: string;
  description: string;
  loadState: ScreenLoadState;
  failedTitle: string;
  skeletonLabel: string;
  onRetry?: () => void;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
}

const UserSection: React.FC<UserSectionProps> = ({
  title,
  description,
  loadState,
  failedTitle,
  skeletonLabel,
  onRetry,
  isEmpty,
  emptyTitle,
  emptyDescription,
  actionHref,
  actionLabel,
  children,
}) => {
  const writesLocked = useWritesLocked();
  const hasAction = actionHref !== undefined && actionLabel !== undefined;
  const showAction = hasAction && loadState === "ready";

  return (
    <Box component="section" className="mb-12 last:mb-0">
      <Group
        justify="space-between"
        align="flex-end"
        gap="md"
        wrap="wrap"
        className="mb-4"
      >
        <Box>
          <Heading
            variant="section"
            className="mb-1 text-[20px] font-semibold text-darkGrey"
          >
            {title}
          </Heading>
          <Text className="text-sm text-grey">{description}</Text>
        </Box>
        {showAction && writesLocked ? (
          <Button
            disabled
            className={`${ADD_BUTTON_DISABLED} w-full sm:w-auto`}
          >
            {actionLabel}
          </Button>
        ) : null}
        {showAction && !writesLocked ? (
          <Button
            component={Link}
            href={actionHref}
            className={`${ADD_BUTTON} w-full sm:w-auto`}
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
      {loadState === "ready" && isEmpty ? (
        <Box className="rounded-[8px] border border-border bg-white px-6 py-8">
          <Text className="font-semibold text-darkGrey">{emptyTitle}</Text>
          <Text className="mt-1 text-sm text-grey">{emptyDescription}</Text>
        </Box>
      ) : null}
      {loadState === "ready" && !isEmpty ? children : null}
    </Box>
  );
};

export default StaffUsersPage;
