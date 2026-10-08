"use client";

import type { Id } from "@convex/_generated/dataModel";
import { Anchor, Box, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

import RepairListTable, {
  type RepairListItem,
} from "../../repairs/RepairListTable/RepairListTable";
import ListEmpty from "../../shared/ListEmpty/ListEmpty";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffFieldWorkerPageProps {
  profileId: Id<"profiles">;
  displayName: string;
  email: string | null;
  hasLogin: boolean;
  jobs: RepairListItem[];
}

const StaffFieldWorkerPage: React.FC<StaffFieldWorkerPageProps> = ({
  profileId,
  displayName,
  email,
  hasLogin,
  jobs,
}) => {
  return (
    <Box className="max-w-[1200px]">
      <Box className="mb-8 sm:mb-10">
        <Group gap={8} className="mb-2 text-[14px] font-medium">
          <Anchor
            component={Link}
            href="/users"
            underline="never"
            className="text-grey hover:text-darkGrey"
          >
            Users
          </Anchor>
        </Group>
        <Group
          justify="space-between"
          align="flex-end"
          gap="md"
          wrap="wrap"
          className="mb-2"
        >
          <Heading
            variant="page"
            className="mb-0 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
          >
            {displayName}
          </Heading>
          <Anchor
            component={Link}
            href={`/field/${profileId}/edit`}
            underline="never"
            className="text-[15px] font-semibold text-grey hover:text-darkGrey"
          >
            Edit field worker
          </Anchor>
        </Group>
        <Text className="text-base text-grey">
          {email ?? "No email"}
          {" · "}
          {hasLogin ? "Can sign in" : "Cannot sign in"}
        </Text>
      </Box>
      {jobs.length === 0 ? (
        <ListEmpty
          title="No jobs assigned."
          description="When staff assign a repair to this person, it will show here."
        />
      ) : (
        <RepairListTable repairs={jobs} showAssignee={false} />
      )}
    </Box>
  );
};

export default StaffFieldWorkerPage;
