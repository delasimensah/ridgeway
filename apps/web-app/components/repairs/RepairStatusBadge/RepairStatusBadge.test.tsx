import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import RepairStatusBadge from "./RepairStatusBadge";

describe("RepairStatusBadge", () => {
  it("shows the status label", () => {
    render(<RepairStatusBadge status="received" />);
    expect(screen.getByText("RECEIVED")).toBeInTheDocument();
  });
});
