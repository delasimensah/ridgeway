"use client";

import { Box } from "@mantine/core";
import React from "react";

import Text from "../../ui/Text/Text";

export interface RepairTimelineItem {
  _id: string;
  title: string;
  detail: string;
}

interface RepairTimelineProps {
  events: RepairTimelineItem[];
}

const RepairTimeline: React.FC<RepairTimelineProps> = ({ events }) => {
  return (
    <Box>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <Box key={event._id} className="relative flex gap-4 pb-8 last:pb-0">
            {isLast ? null : (
              <Box
                aria-hidden
                className="absolute bottom-0 left-[4px] top-3 w-px bg-border"
              />
            )}
            <Box
              aria-hidden
              className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-dotGreen"
            />
            <Box>
              <Text className="font-semibold text-darkGrey">{event.title}</Text>
              <Text className="text-sm text-grey">{event.detail}</Text>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default RepairTimeline;
