import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import BuildingListEmpty from "./BuildingListEmpty";

describe("BuildingListEmpty", () => {
  it("tells staff to add a building", () => {
    render(<BuildingListEmpty />);

    expect(
      screen.getByRole("heading", { name: "No buildings yet." })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add building" })).toHaveAttribute(
      "href",
      "/buildings/new"
    );
  });
});
