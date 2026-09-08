"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ConvexReactClient } from "convex/react";
import React, { useMemo } from "react";

import { mantineTheme } from "@/theme/mantine-theme";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
    }
    return new ConvexReactClient(url);
  }, []);

  return (
    <ConvexAuthProvider client={convex}>
      <MantineProvider theme={mantineTheme}>
        {children}
        <Notifications position="top-right" />
      </MantineProvider>
    </ConvexAuthProvider>
  );
};
