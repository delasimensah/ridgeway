"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ConvexReactClient } from "convex/react";
import React, { Suspense } from "react";

import { LoadingScreen } from "@/components";
import { mantineTheme } from "@/theme/mantine-theme";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "");

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <MantineProvider theme={mantineTheme}>
        <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
        <Notifications position="top-right" />
      </MantineProvider>
    </ConvexAuthNextjsProvider>
  );
};
