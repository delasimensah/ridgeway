import React from "react";
import { RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { JobListItem } from "@/types";

import JobCard from "../../../jobs/JobCard/JobCard";
import LoadFailed from "../../../shared/LoadFailed/LoadFailed";
import ScrollableStack from "../../../ui/ScrollableStack/ScrollableStack";
import { VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";
import JobsScreenSkeleton from "./JobsScreenSkeleton";

interface JobsScreenProps {
  headingDate: string;
  jobs: JobListItem[];
  isLoading?: boolean;
  loadError?: boolean;
  onRetry?: () => void;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenJob: (jobId: string) => void;
}

const JobsScreen: React.FC<JobsScreenProps> = ({
  headingDate,
  jobs,
  isLoading = false,
  loadError = false,
  onRetry,
  refreshing,
  onRefresh,
  onOpenJob,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <VStack
      spacing="none"
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 8 }}
    >
      {isLoading ? (
        <JobsScreenSkeleton />
      ) : (
        <>
          <VStack spacing="sm" paddingX="md" paddingY="sm">
            <Text className="font-app-medium text-[13px] text-grey">
              {headingDate}
            </Text>
            <Text className="font-app-bold text-2xl text-darkGrey">
              Today&apos;s jobs
            </Text>
          </VStack>
          {loadError ? (
            <LoadFailed
              message="Couldn't load jobs."
              onRetry={onRetry ?? (() => undefined)}
            />
          ) : (
            <ScrollableStack
              padding="md"
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {jobs.length === 0 ? (
                <VStack align="center" justify="center" className="py-20">
                  <Text className="text-center font-app-medium text-grey">
                    No jobs assigned today.
                  </Text>
                </VStack>
              ) : (
                <VStack spacing="md">
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onPress={() => onOpenJob(job._id)}
                    />
                  ))}
                </VStack>
              )}
            </ScrollableStack>
          )}
        </>
      )}
    </VStack>
  );
};

export default JobsScreen;
