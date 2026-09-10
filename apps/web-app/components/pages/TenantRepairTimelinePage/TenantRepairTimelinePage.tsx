"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Anchor, Box, Button, Textarea } from "@mantine/core";
import { useMutation } from "convex/react";
import Link from "next/link";
import React, { useState } from "react";
import type { WorkOrderStatus } from "shared";

import {
  formatRepairDate,
  getConvexErrorInfo,
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

interface TenantRepairTimelinePageProps {
  workOrderId: Id<"workOrders">;
  title: string;
  description: string;
  status: WorkOrderStatus;
  category: string | null;
  unitLabel: string;
  buildingName: string;
  reportedAt: number;
  canEditDescription: boolean;
  photoUrls: string[];
  events: TimelineEvent[];
}

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[12px] font-bold uppercase tracking-wider text-grey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
};

const TenantRepairTimelinePage: React.FC<TenantRepairTimelinePageProps> = ({
  workOrderId,
  title,
  description,
  status,
  category,
  unitLabel,
  buildingName,
  reportedAt,
  canEditDescription,
  photoUrls,
  events,
}) => {
  const updateDescription = useMutation(api.workOrders.updateDescription);
  const [draft, setDraft] = useState(description);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await updateDescription({ workOrderId, description: draft });
    } catch (caught) {
      setError(getConvexErrorInfo(caught).message ?? "Could not save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box className="mx-auto w-full max-w-[640px] px-4 py-8 sm:px-6 sm:py-12">
      <Anchor
        component={Link}
        href="/"
        underline="never"
        className="mb-6 inline-flex text-sm font-medium text-grey hover:text-darkGrey"
      >
        Back to home
      </Anchor>
      <Box className="mb-10 flex items-start justify-between gap-4">
        <Heading
          variant="page"
          className="mb-0 text-[24px] font-bold text-darkGrey sm:text-[32px]"
        >
          {title}
        </Heading>
        <RepairStatusBadge status={status} />
      </Box>
      <Box className="mb-10 rounded-[8px] bg-sidebar p-6">
        <Box className="grid grid-cols-2 gap-6">
          <Box>
            <Text className="mb-1 text-[12px] font-bold uppercase tracking-wider text-grey">
              Building
            </Text>
            <Text className="font-semibold">{buildingName}</Text>
          </Box>
          <Box>
            <Text className="mb-1 text-[12px] font-bold uppercase tracking-wider text-grey">
              Unit
            </Text>
            <Text className="font-semibold">{unitLabel}</Text>
          </Box>
          <Box>
            <Text className="mb-1 text-[12px] font-bold uppercase tracking-wider text-grey">
              Category
            </Text>
            <Text className="font-semibold">
              {repairCategoryLabel(category)}
            </Text>
          </Box>
          <Box>
            <Text className="mb-1 text-[12px] font-bold uppercase tracking-wider text-grey">
              Reported
            </Text>
            <Text className="font-semibold">
              {formatRepairDate(reportedAt)}
            </Text>
          </Box>
        </Box>
        <Box className="mt-6 border-t border-border pt-6">
          {canEditDescription ? (
            <>
              <Textarea
                label="Description"
                minRows={3}
                value={draft}
                onChange={(event) => setDraft(event.currentTarget.value)}
                classNames={INPUT_CLASSNAMES}
              />
              {error !== null ? (
                <Text className="mt-2 text-sm text-overdue">{error}</Text>
              ) : null}
              <Button
                onClick={() => void handleSave()}
                loading={isSaving}
                className="mt-3 h-auto rounded-[8px] bg-primary px-6 py-2 text-[15px] font-semibold text-white hover:bg-primaryHover"
              >
                Save description
              </Button>
            </>
          ) : (
            <>
              <Text className="mb-2 text-[12px] font-bold uppercase tracking-wider text-grey">
                Description
              </Text>
              <Text className="text-base leading-relaxed">{description}</Text>
            </>
          )}
        </Box>
        {photoUrls.length > 0 ? (
          <Box className="mt-6">
            <Text className="mb-2 text-[12px] font-bold uppercase tracking-wider text-grey">
              Uploaded photo
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
          className="mb-6 text-[14px] font-bold uppercase tracking-wider text-grey"
        >
          Activity timeline
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

export default TenantRepairTimelinePage;
