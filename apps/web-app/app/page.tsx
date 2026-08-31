import { Box } from "@mantine/core";
import React from "react";

import { Text } from "@/components";

const HomePage = () => {
  return (
    <Box className="flex min-h-screen items-center justify-center bg-black p-16">
      <Box className="max-w-md">
        <Text className="mb-4 text-3xl font-bold text-white">Ridgeway</Text>
        <Text className="text-lg text-grey">
          Operations software for Ridgeway Property Group. Staff, owners,
          tenants, and field workers share one system.
        </Text>
      </Box>
    </Box>
  );
};

export default HomePage;
