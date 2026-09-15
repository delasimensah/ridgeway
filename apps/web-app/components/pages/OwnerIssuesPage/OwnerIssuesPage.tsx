"use client";

import { Box, Stack } from "@mantine/core";
import React from "react";
import type { WorkOrderStatus } from "shared";

import OwnerPortfolioIssueRow from "../../owner/OwnerPortfolioIssueRow/OwnerPortfolioIssueRow";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface OwnerIssue {
  _id: string;
  title: string;
  status: WorkOrderStatus;
  buildingName: string;
  address: string;
  tenantName: string | null;
  unitKind: "apartment" | "commercial";
  reportedAt: number;
}

interface OwnerIssuesPageProps {
  issues: OwnerIssue[];
}

const OwnerIssuesPage: React.FC<OwnerIssuesPageProps> = ({ issues }) => {
  return (
    <Stack gap={0} className="max-w-[1200px]">
      <Heading
        variant="page"
        className="mb-1 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
      >
        Open issues
      </Heading>
      <Text className="mb-8 text-base text-grey md:mb-12">
        Maintenance requests across your portfolio
      </Text>
      <Box component="section">
        <Heading
          variant="section"
          className="mb-6 text-[18px] font-bold uppercase tracking-wider text-grey"
        >
          Active Portfolio Tasks
        </Heading>
        {issues.length === 0 ? (
          <Text className="text-base text-grey">No open issues.</Text>
        ) : (
          <Box className="overflow-hidden rounded-[8px] border border-border bg-white shadow-sm">
            <Box className="divide-y divide-border">
              {issues.map((issue) => (
                <OwnerPortfolioIssueRow
                  key={issue._id}
                  title={issue.title}
                  status={issue.status}
                  buildingName={issue.buildingName}
                  address={issue.address}
                  tenantName={issue.tenantName}
                  unitKind={issue.unitKind}
                  reportedAt={issue.reportedAt}
                />
              ))}
            </Box>
          </Box>
        )}
        <Text className="mt-6 text-center text-sm text-grey">
          You are viewing only your owned properties. Maintenance is managed by
          Ridgeway Staff.
        </Text>
      </Box>
    </Stack>
  );
};

export default OwnerIssuesPage;
