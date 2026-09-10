"use client";

import { Anchor, Box } from "@mantine/core";
import Link from "next/link";
import React from "react";
import type { WorkOrderStatus } from "shared";

import {
  formatRepairDate,
  repairCategoryLabel,
  repairEventTitle,
} from "@/utils";

import RepairStatusBadge from "../../repairs/RepairStatusBadge/RepairStatusBadge";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface TimelineEvent {
  _id: string;
  toStatus: WorkOrderStatus;
  actorName: string;
  createdAt: number;
}

interface StaffRepairDetailPageProps {
  title: string;
  description: string;
  status: WorkOrderStatus;
  category: string | null;
  unitLabel: string;
  buildingName: string;
  buildingId: string;
  tenantName: string;
  reportedAt: number;
  photoUrls: string[];
  events: TimelineEvent[];
}

const StaffRepairDetailPage: React.FC<StaffRepairDetailPageProps> = ({
  title,
  description,
  status,
  category,
  unitLabel,
  buildingName,
  buildingId,
  tenantName,
  reportedAt,
  photoUrls,
  events,
}) => {
  return (
    <Box className="max-w-[1200px]">
      <Box className="mb-2 flex flex-wrap items-center gap-2 text-sm font-medium text-grey">
        <Anchor
          component={Link}
          href={`/buildings/${buildingId}`}
          underline="never"
          className="text-grey hover:text-darkGrey"
        >
          {buildingName}
        </Anchor>
        <Text component="span" className="text-sm text-grey">
          ·
        </Text>
        <Text className="text-sm text-grey">{title}</Text>
      </Box>
      <Box className="mb-10 flex items-start justify-between gap-4">
        <Heading
          variant="page"
          className="mb-0 text-[24px] font-bold text-darkGrey sm:text-[32px]"
        >
          Repair: {title}
        </Heading>
        <RepairStatusBadge status={status} />
      </Box>
      <Box className="mb-12 rounded-[8px] border border-border bg-white p-6 shadow-sm sm:p-8">
        <Box className="grid gap-8 sm:grid-cols-2">
          <Box>
            <Text className="mb-2 text-[13px] font-bold uppercase tracking-wider text-grey">
              Tenant
            </Text>
            <Text className="text-base font-semibold">{tenantName}</Text>
            <Text className="text-sm text-grey">
              {buildingName} · {unitLabel}
            </Text>
          </Box>
          <Box>
            <Text className="mb-2 text-[13px] font-bold uppercase tracking-wider text-grey">
              Category
            </Text>
            <Text className="text-base font-semibold">
              {repairCategoryLabel(category)}
            </Text>
            <Text className="text-sm text-grey">
              Reported {formatRepairDate(reportedAt)}
            </Text>
          </Box>
        </Box>
        <Box className="mt-6 border-t border-border pt-6">
          <Text className="mb-2 text-[13px] font-bold uppercase tracking-wider text-grey">
            Description
          </Text>
          <Text className="text-base leading-relaxed">{description}</Text>
        </Box>
        {photoUrls.length > 0 ? (
          <Box className="mt-6">
            <Text className="mb-2 text-[13px] font-bold uppercase tracking-wider text-grey">
              Photo
            </Text>
            <Box className="flex flex-wrap gap-3">
              {photoUrls.map((url) => (
                <Box
                  key={url}
                  component="img"
                  src={url}
                  alt="Repair photo"
                  className="h-24 w-24 rounded border border-border object-cover"
                />
              ))}
            </Box>
          </Box>
        ) : null}
      </Box>
      <Box component="section">
        <Heading
          variant="section"
          className="mb-6 text-[18px] font-bold text-darkGrey"
        >
          Timeline
        </Heading>
        <Box className="space-y-8">
          {events.map((event) => (
            <Box key={event._id}>
              <Text className="font-bold">
                {repairEventTitle(event.toStatus)}
              </Text>
              <Text className="text-sm text-grey">
                {event.actorName} · {formatRepairDate(event.createdAt)}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StaffRepairDetailPage;
