import { Box } from "@mantine/core";
import React from "react";

/**
 * Layout for authenticated main application pages.
 * Route protection is enforced in middleware with Convex Auth.
 */
const MainAppLayout = ({ children }: { children: React.ReactNode }) => {
  return <Box className="min-h-screen bg-black">{children}</Box>;
};

export default MainAppLayout;
