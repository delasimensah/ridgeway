import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
import type { WorkOrderStatus } from "shared";

import { COLORS } from "@/constants";
import { useAppInsets } from "@/hooks";

import JobStatusChip from "../../../jobs/JobStatusChip/JobStatusChip";
import LoadFailed from "../../../shared/LoadFailed/LoadFailed";
import Button from "../../../ui/Button/Button";
import ScrollableStack from "../../../ui/ScrollableStack/ScrollableStack";
import SkeletonCard from "../../../ui/SkeletonCard/SkeletonCard";
import { HStack, VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";
import JobDetailScreenSkeleton from "./JobDetailScreenSkeleton";

interface JobDetailScreenProps {
  isLoading?: boolean;
  loadError?: boolean;
  onRetry?: () => void;
  title: string;
  buildingName: string;
  unitLabel: string;
  address: string;
  status: WorkOrderStatus;
  description: string;
  canUpdateStatus: boolean;
  onBack: () => void;
  onUpdateStatus: () => void;
}

const JobDetailScreen: React.FC<JobDetailScreenProps> = ({
  isLoading = false,
  loadError = false,
  onRetry,
  title,
  buildingName,
  unitLabel,
  address,
  status,
  description,
  canUpdateStatus,
  onBack,
  onUpdateStatus,
}) => {
  const insets = useAppInsets();
  const [street, ...rest] = address.split(",").map((part) => part.trim());

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
        {isLoading ? (
          <VStack spacing="none" align="center" className="flex-1">
            <SkeletonCard width={160} height={20} radius={4} />
          </VStack>
        ) : (
          <Text className="flex-1 text-center font-app-bold text-lg text-darkGrey">
            {title}
          </Text>
        )}
        <VStack spacing="none" className="h-10 w-10" />
      </HStack>
      {isLoading ? (
        <JobDetailScreenSkeleton />
      ) : loadError ? (
        <LoadFailed
          message="Couldn't load this job."
          onRetry={onRetry ?? (() => undefined)}
        />
      ) : (
        <ScrollableStack padding="md">
          <VStack spacing="lg">
            <HStack align="start" justify="between">
              <Text className="flex-1 font-app-bold text-xl text-darkGrey">
                {buildingName} · {unitLabel}
              </Text>
              <JobStatusChip status={status} />
            </HStack>
            <HStack spacing="md" align="start">
              <Ionicons
                name="location-sharp"
                size={16}
                color={COLORS.grey}
                style={{ marginTop: 4 }}
              />
              <VStack spacing="none">
                <Text className="font-app-medium text-grey">{street}</Text>
                {rest.length > 0 ? (
                  <Text className="text-grey">{rest.join(", ")}</Text>
                ) : null}
              </VStack>
            </HStack>
            <VStack
              spacing="sm"
              className="rounded-lg border border-border bg-white p-4"
            >
              <Text className="font-app-bold text-sm uppercase tracking-wider text-grey">
                Instructions
              </Text>
              <Text className="leading-relaxed text-darkGrey">
                {description}
              </Text>
            </VStack>
          </VStack>
        </ScrollableStack>
      )}
      {!isLoading && !loadError && canUpdateStatus ? (
        <VStack
          padding="md"
          className="border-t border-border bg-white"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Button text="Update status" fullWidth onPress={onUpdateStatus} />
        </VStack>
      ) : null}
    </VStack>
  );
};

export default JobDetailScreen;
