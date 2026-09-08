import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import UnitListEmpty from "./UnitListEmpty";

describe("UnitListEmpty", () => {
  it("tells staff to add a unit under the building", () => {
    render(<UnitListEmpty buildingId="building-1" />);

    expect(
      screen.getByRole("heading", { name: "No units yet." })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add unit" })).toHaveAttribute(
      "href",
      "/buildings/building-1/units/new"
    );
  });
});
