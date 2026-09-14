import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffRentSummary from "./StaffRentSummary";

describe("StaffRentSummary", () => {
  it("shows collected and outstanding totals", () => {
    render(
      <StaffRentSummary
        collected={8640000}
        outstanding={1215000}
        currency="GHS"
      />
    );

    expect(screen.getByText("Collected")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 86,400")).toBeInTheDocument();
    expect(screen.getByText("Outstanding")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 12,150")).toBeInTheDocument();
  });
});
