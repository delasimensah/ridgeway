"use client";

import { StaffGate } from "@/components";

const StaffOnlyLayout = ({ children }: { children: React.ReactNode }) => {
  return <StaffGate>{() => children}</StaffGate>;
};

export default StaffOnlyLayout;
