import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
import React from "react";

import { appfont } from "@/constants";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Ridgeway",
  description:
    "Operations software for Ridgeway Property Group — staff, owners, tenants, and field work.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="en"
        className={appfont.variable}
        {...mantineHtmlProps}
        suppressHydrationWarning
      >
        <head>
          <ColorSchemeScript />
        </head>
        <body className="font-regular bg-black">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
};

export default RootLayout;
