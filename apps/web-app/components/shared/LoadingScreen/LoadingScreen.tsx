import { Box } from "@mantine/core";
import React from "react";
import { cn } from "shared";

import Text from "../../ui/Text/Text";

interface LoadingScreenProps {
  fillViewport?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  fillViewport = true,
}) => {
  return (
    <Box
      className={cn(
        "flex items-center justify-center bg-white",
        fillViewport ? "min-h-screen" : "min-h-[40vh]"
      )}
    >
      <Text className="text-lg text-grey">Loading...</Text>
    </Box>
  );
};

export default LoadingScreen;
