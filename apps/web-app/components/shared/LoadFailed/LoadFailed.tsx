"use client";

import { Box, Button, Stack } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import React from "react";

import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface LoadFailedProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-8 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover";

const DEFAULT_DESCRIPTION =
  "There was a problem connecting to the server. Please try again or contact support if the issue persists.";

function reloadWindow(): void {
  window.location.reload();
}

const LoadFailed: React.FC<LoadFailedProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  onRetry = reloadWindow,
}) => {
  return (
    <Box className="flex min-h-[240px] flex-col items-center justify-center rounded-[8px] border border-danger/20 bg-white p-6 text-center sm:min-h-[320px] sm:p-10 md:min-h-[400px] md:p-12">
      <Stack align="center" gap="md">
        <Box className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
          <IconAlertTriangle size={20} aria-hidden />
        </Box>
        <Heading variant="section" className="mb-0 text-[20px] font-bold">
          {title}
        </Heading>
        <Text className="max-w-[320px] text-grey">{description}</Text>
        <Button onClick={onRetry} className={PRIMARY_BUTTON}>
          Try again
        </Button>
      </Stack>
    </Box>
  );
};

export default LoadFailed;
