import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerBuildingCard from "./OwnerBuildingCard";

describe("OwnerBuildingCard", () => {
  it("shows the building name and Accra address", () => {
    render(
      <OwnerBuildingCard
        name="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Ridge Court" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("14 Ridge Road, Cantonments, Accra")
    ).toBeInTheDocument();
  });
});
