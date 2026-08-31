import { Box } from "@mantine/core";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <Box className="min-h-screen bg-black">{children}</Box>;
};

export default AuthLayout;
