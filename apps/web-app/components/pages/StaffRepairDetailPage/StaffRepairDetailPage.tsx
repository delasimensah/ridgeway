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

import AssignRepairForm, {
  type FieldWorkerOption,
} from "../../repairs/AssignRepairForm/AssignRepairForm";
import RepairStatusBadge from "../../repairs/RepairStatusBadge/RepairStatusBadge";
import RepairTimeline from "../../repairs/RepairTimeline/RepairTimeline";
import ScheduleRepairForm from "../../repairs/ScheduleRepairForm/ScheduleRepairForm";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface TimelineEvent {
  _id: string;
  toStatus: WorkOrderStatus;
  actorName: string;
  createdAt: number;
}

interface StaffRepairDetailPageProps {
  workOrderId: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  category: string | null;
  unitLabel: string;
  buildingName: string;
  buildingId: string;
  tenantName: string;
  assigneeName: string | null;
  scheduledFor: string | null;
  reportedAt: number;
  canAssign: boolean;
  canSchedule: boolean;
  fieldWorkers: FieldWorkerOption[];
  photoUrls: string[];
  completionPhotoUrls: string[];
  events: TimelineEvent[];
}

const StaffRepairDetailPage: React.FC<StaffRepairDetailPageProps> = ({
  workOrderId,
  title,
  description,
  status,
  category,
  unitLabel,
  buildingName,
  buildingId,
  tenantName,
  assigneeName,
  scheduledFor,
  reportedAt,
  canAssign,
  canSchedule,
  fieldWorkers,
  photoUrls,
  completionPhotoUrls,
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
      <Box className="mb-6 flex items-start justify-between gap-4">
        <Heading
          variant="page"
          className="mb-0 text-[24px] font-bold text-darkGrey sm:text-[32px]"
        >
          Repair: {title}
        </Heading>
        <RepairStatusBadge status={status} />
      </Box>
      {canAssign || canSchedule ? (
        <Box className="mb-10">
          {canAssign ? (
            <AssignRepairForm
              workOrderId={workOrderId as never}
              fieldWorkers={fieldWorkers}
            />
          ) : null}
          {canSchedule ? (
            <ScheduleRepairForm workOrderId={workOrderId as never} />
          ) : null}
        </Box>
      ) : null}
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
          {assigneeName !== null ? (
            <Box>
              <Text className="mb-2 text-[13px] font-bold uppercase tracking-wider text-grey">
                Assigned to
              </Text>
              <Text className="text-base font-semibold">{assigneeName}</Text>
            </Box>
          ) : null}
          {scheduledFor !== null ? (
            <Box>
              <Text className="mb-2 text-[13px] font-bold uppercase tracking-wider text-grey">
                Scheduled
              </Text>
              <Text className="text-base font-semibold">{scheduledFor}</Text>
            </Box>
          ) : null}
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
                  className="h-40 w-40 rounded-[8px] border border-border bg-primary object-cover"
                />
              ))}
            </Box>
          </Box>
        ) : null}
        {completionPhotoUrls.length > 0 ? (
          <Box className="mt-6">
            <Text className="mb-2 text-[13px] font-bold uppercase tracking-wider text-grey">
              Completion photo
            </Text>
            <Box className="flex flex-wrap gap-3">
              {completionPhotoUrls.map((url) => (
                <Box
                  key={url}
                  component="img"
                  src={url}
                  alt="Completion photo"
                  className="h-40 w-40 rounded-[8px] border border-border bg-primary object-cover"
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
        <RepairTimeline
          events={events.map((event) => ({
            _id: event._id,
            title: repairEventTitle(event.toStatus),
            detail: `${event.actorName} · ${formatRepairDate(event.createdAt)}`,
          }))}
        />
      </Box>
    </Box>
  );
};

export default StaffRepairDetailPage;
