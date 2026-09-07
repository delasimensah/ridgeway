import { Box } from "@mantine/core";
import React from "react";

import Text from "../../ui/Text/Text";

const LoadingScreen: React.FC = () => {
  return (
    <Box className="flex min-h-screen items-center justify-center bg-white">
      <Text className="text-lg text-grey">Loading...</Text>
    </Box>
  );
};

export default LoadingScreen;
