import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerPortfolioStatus from "./OwnerPortfolioStatus";

describe("OwnerPortfolioStatus", () => {
  it("shows collected versus outstanding for this month", () => {
    render(
      <OwnerPortfolioStatus
        collected={450000}
        outstanding={0}
        currency="GHS"
        buildingCount={1}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Portfolio status" })
    ).toBeInTheDocument();
    expect(screen.getByText("GH₵ 4,500")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 0")).toBeInTheDocument();
    expect(screen.getByText("Across 1 building")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View Rent Details" })
    ).toHaveAttribute("href", "/rent");
  });
});
