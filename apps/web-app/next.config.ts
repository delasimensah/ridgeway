import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["shared"],
  images: {
    remotePatterns: [],
  },
  // The Next.js build succeeds.
  // Vercel then fails while uploading the site.
  // Next 16.3's hashed static-file upload cannot run at the same time as Vercel Preview Comments.
  // This flag uses the old upload path so the deploy can finish.
  supportsImmutableAssets: false,
  // Stop Next.js from rewriting repo AGENTS.md / CLAUDE.md on `next dev`.
  agentRules: false,
  experimental: {
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/notifications",
      "@mantine/dates",
      "@mantine/form",
    ],
  },
};

export default nextConfig;
