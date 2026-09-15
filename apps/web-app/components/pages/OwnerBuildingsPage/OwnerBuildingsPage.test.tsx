import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerBuildingsPage from "./OwnerBuildingsPage";

describe("OwnerBuildingsPage", () => {
  it("lists this owner's buildings and hides another owner's name", () => {
    render(
      <OwnerBuildingsPage
        buildings={[
          {
            _id: "b1",
            name: "Ridge Court",
            address: "14 Ridge Road, Cantonments, Accra",
            occupiedCount: 1,
            unitCount: 1,
            openRepairCount: 0,
            collected: 450000,
            outstanding: 0,
            currency: "GHS",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Buildings" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ridge Court" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Labone walk-up")).not.toBeInTheDocument();
  });
});
