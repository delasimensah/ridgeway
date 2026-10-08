import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, View } from "react-native";
import type { WorkOrderStatus } from "shared";
import { cn } from "shared";

import { COLORS } from "@/constants";
import { useAppInsets } from "@/hooks";
import {
  formatRepairDateTime,
  JOB_STATUS_LABEL,
  timelineStepState,
} from "@/utils";

import JobStatusChip from "../../../jobs/JobStatusChip/JobStatusChip";
import ScrollableStack from "../../../ui/ScrollableStack/ScrollableStack";
import { HStack, VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

interface TimelineEvent {
  _id: string;
  toStatus: WorkOrderStatus;
  createdAt: number;
}

interface TenantRepairTimelineScreenProps {
  title: string;
  status: WorkOrderStatus;
  assigneeName: string | null;
  scheduledFor: string | null;
  reportedAt: number;
  photoUrls: string[];
  completionPhotoUrls: string[];
  events: TimelineEvent[];
  onBack: () => void;
}

const STEPS: WorkOrderStatus[] = ["received", "assigned", "scheduled", "done"];

function eventForStatus(
  events: TimelineEvent[],
  status: WorkOrderStatus
): TimelineEvent | undefined {
  return events.find((event) => event.toStatus === status);
}

function stepCopy(args: {
  step: WorkOrderStatus;
  state: "completed" | "active" | "pending";
  reportedAt: number;
  assigneeName: string | null;
  scheduledFor: string | null;
  events: TimelineEvent[];
}): string {
  if (args.step === "received") {
    const received = eventForStatus(args.events, "received");
    return `Reported on ${formatRepairDateTime(received?.createdAt ?? args.reportedAt)}`;
  }
  if (args.step === "assigned") {
    if (args.state === "pending") {
      return "Waiting for a technician.";
    }
    if (args.assigneeName !== null) {
      return `${args.assigneeName} has been assigned to your case.`;
    }
    return "A technician has been assigned to your case.";
  }
  if (args.step === "scheduled") {
    if (args.state === "pending") {
      return "Waiting for technician availability.";
    }
    if (args.scheduledFor !== null) {
      return `Scheduled for ${args.scheduledFor}.`;
    }
    return "Visit scheduled.";
  }
  if (args.state === "pending") {
    return "Job completion and verification.";
  }
  return "Job completed.";
}

const TenantRepairTimelineScreen: React.FC<TenantRepairTimelineScreenProps> = ({
  title,
  status,
  assigneeName,
  scheduledFor,
  reportedAt,
  photoUrls,
  completionPhotoUrls,
  events,
  onBack,
}) => {
  const insets = useAppInsets();

  return (
    <VStack spacing="none" className="flex-1 bg-sidebar">
      <HStack
        align="center"
        justify="between"
        paddingX="md"
        className="border-b border-border bg-white"
        style={{ paddingTop: insets.top + 8, paddingBottom: 16 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          className="h-10 w-10 items-start justify-center"
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.darkGrey} />
        </Pressable>
        <Text
          className="flex-1 text-center font-app-bold text-lg text-darkGrey"
          numberOfLines={1}
        >
          {title}
        </Text>
        <VStack spacing="none" className="h-10 w-10" />
      </HStack>
      <ScrollableStack padding="md">
        <VStack spacing="lg" className="pb-8">
          <HStack align="start" justify="between">
            <VStack spacing="none" className="flex-1 pr-3">
              <Text className="font-app-bold text-xl text-darkGrey">
                Repair Status
              </Text>
            </VStack>
            <JobStatusChip status={status} />
          </HStack>
          <View className="relative pl-2">
            <View className="absolute bottom-2 left-[23px] top-2 w-0.5 bg-border" />
            <VStack spacing="xl">
              {STEPS.map((step) => {
                const state = timelineStepState(status, step);
                const photos =
                  step === "received"
                    ? photoUrls
                    : step === "done"
                      ? completionPhotoUrls
                      : [];
                return (
                  <HStack key={step} spacing="md" align="start">
                    <View
                      className={cn(
                        "z-10 h-8 w-8 items-center justify-center rounded-full border-2 bg-white",
                        state === "pending"
                          ? "border-border"
                          : "border-primary bg-primary"
                      )}
                    >
                      {state === "completed" ? (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={COLORS.white}
                        />
                      ) : state === "active" ? (
                        <View className="h-2.5 w-2.5 rounded-full bg-white" />
                      ) : null}
                    </View>
                    <VStack spacing="sm" className="flex-1 pt-1">
                      <Text
                        className={cn(
                          "font-app-bold text-base",
                          state === "pending" ? "text-grey" : "text-darkGrey"
                        )}
                      >
                        {JOB_STATUS_LABEL[step]}
                      </Text>
                      <Text
                        className={cn(
                          "text-sm",
                          state === "pending" ? "text-grey" : "text-grey"
                        )}
                      >
                        {stepCopy({
                          step,
                          state,
                          reportedAt,
                          assigneeName,
                          scheduledFor,
                          events,
                        })}
                      </Text>
                      {photos.map((url) => (
                        <View
                          key={url}
                          accessible
                          accessibilityLabel={
                            step === "done"
                              ? "Completion photo"
                              : "Repair photo"
                          }
                        >
                          <Image
                            source={{ uri: url }}
                            className="h-24 w-24 rounded-lg border border-border bg-primary"
                            style={{ backgroundColor: COLORS.primary }}
                            contentFit="cover"
                          />
                        </View>
                      ))}
                    </VStack>
                  </HStack>
                );
              })}
            </VStack>
          </View>
        </VStack>
      </ScrollableStack>
    </VStack>
  );
};

export default TenantRepairTimelineScreen;
