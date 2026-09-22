import { Box } from "@mantine/core";
import React from "react";

import BrandMark from "../../ui/BrandMark/BrandMark";

const LoadingScreen: React.FC = () => {
  return (
    <Box className="flex min-h-screen items-center justify-center bg-accent">
      <BrandMark
        size="splash"
        headingClassName="mb-0 text-[32px] font-bold tracking-tight text-primary"
      />
    </Box>
  );
};

export default LoadingScreen;
