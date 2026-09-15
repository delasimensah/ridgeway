import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffOfficePage from "./StaffOfficePage";

describe("StaffOfficePage", () => {
  it("lists office people", () => {
    render(
      <StaffOfficePage
        people={[
          {
            _id: "1",
            displayName: "Ama Boateng",
            email: "ama.boateng@ridgeway.gh",
            hasLogin: true,
          },
        ]}
      />
    );

    expect(screen.getByRole("heading", { name: "Staff" })).toBeInTheDocument();
    expect(screen.getByText("Ama Boateng")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Add office person" })
    ).toHaveAttribute("href", "/office/new");
    expect(screen.queryByText("No office people yet.")).not.toBeInTheDocument();
  });

  it("shows an empty state with a next action when there are none", () => {
    render(<StaffOfficePage people={[]} />);
    expect(
      screen.getByRole("heading", { name: "No office people yet." })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Add office person" }).length
    ).toBe(2);
  });
});
