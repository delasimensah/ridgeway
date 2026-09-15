import { Box } from "@mantine/core";
import React from "react";

import Heading from "../../ui/Heading/Heading";

const LoadingScreen: React.FC = () => {
  return (
    <Box className="flex min-h-screen items-center justify-center bg-accent">
      <Heading
        variant="page"
        className="mb-0 text-[32px] font-bold tracking-tight text-primary"
      >
        Ridgeway
      </Heading>
    </Box>
  );
};

export default LoadingScreen;
