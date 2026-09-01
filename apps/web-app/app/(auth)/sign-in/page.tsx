import { Box } from "@mantine/core";
import React from "react";

import { Text } from "@/components";

const SignInPage = () => {
  return (
    <Box className="flex min-h-screen items-center justify-center bg-black p-16">
      <Box className="max-w-sm">
        <Text className="mb-2 text-3xl font-bold text-white">Sign in</Text>
        <Text className="text-grey">
          Sign in is not connected yet. It will be wired when Convex is added.
        </Text>
      </Box>
    </Box>
  );
};

export default SignInPage;
