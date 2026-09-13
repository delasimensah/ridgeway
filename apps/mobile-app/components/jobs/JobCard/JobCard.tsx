import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";

import { COLORS } from "@/constants";
import type { JobListItem } from "@/types";

import { HStack, VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";
import JobStatusChip from "../JobStatusChip/JobStatusChip";

interface JobCardProps {
  job: JobListItem;
  onPress: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={job.title}
      onPress={onPress}
      className="rounded-lg border border-border bg-white p-3"
    >
      <VStack spacing="sm">
        <HStack align="start" justify="between">
          <VStack spacing="none" className="flex-1">
            <Text className="font-app-bold text-[13px] text-darkGrey">
              {job.buildingName} · {job.unitLabel}
            </Text>
            <Text className="font-app-bold text-lg text-darkGrey">
              {job.title}
            </Text>
          </VStack>
          <JobStatusChip status={job.status} />
        </HStack>
        <HStack spacing="sm" align="center">
          <Ionicons name="location-sharp" size={12} color={COLORS.grey} />
          <Text className="text-sm text-grey">{job.address}</Text>
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default JobCard;
