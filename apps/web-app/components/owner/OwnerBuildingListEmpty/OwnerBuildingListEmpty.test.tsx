import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerBuildingListEmpty from "./OwnerBuildingListEmpty";

describe("OwnerBuildingListEmpty", () => {
  it("explains that this owner has no buildings yet", () => {
    render(<OwnerBuildingListEmpty />);

    expect(
      screen.getByRole("heading", { name: "No buildings yet." })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/will not see another owner's buildings/i)
    ).toBeInTheDocument();
  });
});
