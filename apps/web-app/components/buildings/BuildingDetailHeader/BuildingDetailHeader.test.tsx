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
    expect(screen.getByRole("link", { name: "Add owner" })).toHaveAttribute(
      "href",
      "/buildings/building-1/owners/new"
    );
  });

  it("shows the owner name when a building has an owner", () => {
    render(
      <BuildingDetailHeader
        buildingId="building-1"
        name="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        ownerId="owner-1"
        ownerName="Kwesi Mensah"
      />
    );

    expect(
      screen.getByText(
        "14 Ridge Road, Cantonments, Accra · Owner: Kwesi Mensah"
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Edit owner" })).toHaveAttribute(
      "href",
      "/owners/owner-1/edit"
    );
    expect(
      screen.queryByRole("link", { name: "Add owner" })
    ).not.toBeInTheDocument();
  });
});
