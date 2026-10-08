"use client";

import type { Id } from "@convex/_generated/dataModel";
import { Anchor, Box, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

import OwnerBuildingListTable, {
  type OwnerBuildingListItem,
} from "../../owners/OwnerBuildingListTable/OwnerBuildingListTable";
import ListEmpty from "../../shared/ListEmpty/ListEmpty";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface StaffOwnerPageProps {
  ownerId: Id<"owners">;
  displayName: string;
  contactEmail: string | null;
  hasLogin: boolean;
  buildings: OwnerBuildingListItem[];
}

const StaffOwnerPage: React.FC<StaffOwnerPageProps> = ({
  ownerId,
  displayName,
  contactEmail,
  hasLogin,
  buildings,
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
            href={`/owners/${ownerId}/edit`}
            underline="never"
            className="text-[15px] font-semibold text-grey hover:text-darkGrey"
          >
            Edit owner
          </Anchor>
        </Group>
        <Text className="text-base text-grey">
          {contactEmail ?? "No email"}
          {" · "}
          {hasLogin ? "Can sign in" : "Cannot sign in"}
        </Text>
      </Box>
      {buildings.length === 0 ? (
        <ListEmpty
          title="No buildings yet."
          description="This owner has no buildings attached."
        />
      ) : (
        <OwnerBuildingListTable buildings={buildings} />
      )}
    </Box>
  );
};

export default StaffOwnerPage;
