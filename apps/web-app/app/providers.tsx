"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React, { Suspense } from "react";

import { LoadingScreen } from "@/components";
import { mantineTheme } from "@/theme/mantine-theme";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <MantineProvider theme={mantineTheme}>
      <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
      <Notifications position="top-right" />
    </MantineProvider>
  );
};
