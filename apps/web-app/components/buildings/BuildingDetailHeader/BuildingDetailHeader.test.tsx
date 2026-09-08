import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import BuildingDetailHeader from "./BuildingDetailHeader";

describe("BuildingDetailHeader", () => {
  it("shows the building name, address, and a way back to the list", () => {
    render(
      <BuildingDetailHeader
        buildingId="building-1"
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
    expect(screen.getByRole("link", { name: "Buildings" })).toHaveAttribute(
      "href",
      "/buildings"
    );
    expect(screen.getByRole("link", { name: "Edit building" })).toHaveAttribute(
      "href",
      "/buildings/building-1/edit"
    );
  });
});
