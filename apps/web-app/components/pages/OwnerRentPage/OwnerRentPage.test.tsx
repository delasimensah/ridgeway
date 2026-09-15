import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerRentPage from "./OwnerRentPage";

describe("OwnerRentPage", () => {
  it("shows collected versus outstanding for this owner's buildings only", () => {
    render(
      <OwnerRentPage
        collected={450000}
        outstanding={0}
        currency="GHS"
        buildings={[
          {
            buildingId: "b1",
            name: "Ridge Court",
            address: "14 Ridge Road, Cantonments, Accra",
            collected: 450000,
            outstanding: 0,
          },
        ]}
      />
    );

    expect(screen.getByRole("heading", { name: "Rent" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Building Breakdown" })
    ).toBeInTheDocument();
    expect(screen.getByText("Ridge Court")).toBeInTheDocument();
    expect(screen.queryByText("Labone walk-up")).not.toBeInTheDocument();
    expect(screen.getByText("Total Portfolio")).toBeInTheDocument();
  });
});
