import { Ionicons } from "@expo/vector-icons";
import React from "react";

import { COLORS } from "@/constants";
import type { JobListItem } from "@/types";
import { JOB_STATUS_STRIPE } from "@/utils";

import { HStack, VStack } from "../../ui/Stack/Stack";
import SurfaceCard from "../../ui/SurfaceCard/SurfaceCard";
import Text from "../../ui/Text/Text";
import JobStatusChip from "../JobStatusChip/JobStatusChip";

interface JobCardProps {
  job: JobListItem;
  onPress: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  return (
    <SurfaceCard
      stripeColor={JOB_STATUS_STRIPE[job.status]}
      paddingClassName="p-3"
      accessibilityLabel={job.title}
      onPress={onPress}
    >
      <VStack spacing="sm">
        <HStack align="start" justify="between">
          <VStack spacing="none" className="flex-1 pr-2">
            <Text className="font-app-medium text-[13px] text-grey">
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
          <Text className="flex-1 text-sm text-grey">{job.address}</Text>
        </HStack>
      </VStack>
    </SurfaceCard>
  );
};

export default JobCard;
