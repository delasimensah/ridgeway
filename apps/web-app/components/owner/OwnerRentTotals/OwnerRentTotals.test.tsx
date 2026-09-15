import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerRentTotals from "./OwnerRentTotals";

describe("OwnerRentTotals", () => {
  it("shows collected versus outstanding for the portfolio", () => {
    render(
      <OwnerRentTotals collected={450000} outstanding={0} currency="GHS" />
    );

    expect(screen.getByText("Collected")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 4,500")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Outstanding")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 0")).toBeInTheDocument();
  });
});
