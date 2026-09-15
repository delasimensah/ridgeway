import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerBuildingCard from "./OwnerBuildingCard";

describe("OwnerBuildingCard", () => {
  it("shows occupancy, open issues, and rent for this building", () => {
    render(
      <OwnerBuildingCard
        href="/buildings/b1"
        name="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        occupiedCount={1}
        unitCount={2}
        openRepairCount={1}
        collected={450000}
        outstanding={0}
        currency="GHS"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Ridge Court" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("14 Ridge Road, Cantonments, Accra")
    ).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 4,500")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 0")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ridge court/i })).toHaveAttribute(
      "href",
      "/buildings/b1"
    );
  });
});
