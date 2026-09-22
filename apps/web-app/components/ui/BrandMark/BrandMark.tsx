"use client";

import { Box } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { cn } from "shared";

import { ASSETS } from "@/constants";

import Heading from "../Heading/Heading";

type BrandMarkSize = "nav" | "header" | "page" | "splash";

const SIZE_CONFIG: Record<
  BrandMarkSize,
  {
    mark: number;
    layout: "inline" | "stack";
    headingVariant: "page" | "section";
  }
> = {
  nav: { mark: 28, layout: "inline", headingVariant: "section" },
  header: { mark: 24, layout: "inline", headingVariant: "section" },
  page: { mark: 48, layout: "stack", headingVariant: "page" },
  splash: { mark: 56, layout: "stack", headingVariant: "page" },
};

interface BrandMarkProps {
  size: BrandMarkSize;
  headingClassName: string;
  className?: string;
  /** When set, the mark and wordmark are one link (tenant header). */
  href?: string;
}

const BrandMark: React.FC<BrandMarkProps> = ({
  size,
  headingClassName,
  className,
  href,
}) => {
  const { mark, layout, headingVariant } = SIZE_CONFIG[size];
  const body = (
    <Box
      className={cn(
        "flex items-center",
        layout === "stack" ? "flex-col gap-3" : "flex-row gap-2.5",
        className
      )}
    >
      {/* Decorative — wordmark carries the accessible name */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ASSETS.icons.logo}
        alt=""
        width={mark}
        height={mark}
        className="shrink-0"
        decoding="async"
        role="presentation"
      />
      <Heading variant={headingVariant} className={headingClassName}>
        Ridgeway
      </Heading>
    </Box>
  );

  if (href) {
    return (
      <Box component={Link} href={href} className="text-inherit no-underline">
        {body}
      </Box>
    );
  }

  return body;
};

export default BrandMark;
