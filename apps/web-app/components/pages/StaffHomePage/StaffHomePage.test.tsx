import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffHomePage from "./StaffHomePage";

describe("StaffHomePage", () => {
  it("shows the greeting and an almost empty home", () => {
    render(<StaffHomePage greeting="Good afternoon, Ama" />);

    expect(
      screen.getByRole("heading", { name: "Good afternoon, Ama" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Buildings and repairs will show here.")
    ).toBeInTheDocument();
  });
});
