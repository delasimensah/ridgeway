import type { Metadata } from "next";
import React from "react";

import NotFoundPage from "@/components/pages/NotFoundPage/NotFoundPage";

export const metadata: Metadata = {
  title: "Page not found",
};

const NotFound = () => {
  return <NotFoundPage />;
};

export default NotFound;
