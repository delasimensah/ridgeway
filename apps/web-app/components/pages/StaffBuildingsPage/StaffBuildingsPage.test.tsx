import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffBuildingsPage from "./StaffBuildingsPage";

describe("StaffBuildingsPage", () => {
  it("shows the empty next action when there are no buildings", () => {
    render(<StaffBuildingsPage buildings={[]} />);

    expect(
      screen.getByRole("heading", { name: "Buildings" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "No buildings yet." })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Add building" }).length).toBe(
      2
    );
    expect(
      screen.queryByRole("link", { name: "Add owner" })
    ).not.toBeInTheDocument();
  });

  it("shows saved buildings in the list", () => {
    render(
      <StaffBuildingsPage
        buildings={[
          {
            _id: "1",
            name: "Ridge Court",
            address: "14 Ridge Road, Cantonments, Accra",
            ownerName: "Kwesi Mensah",
            unitCount: 0,
            openRepairCount: 0,
          },
        ]}
      />
    );

    expect(screen.getByText("Ridge Court")).toBeInTheDocument();
    expect(screen.getByText("Kwesi Mensah")).toBeInTheDocument();
    expect(
      screen.getByText("14 Ridge Road, Cantonments, Accra")
    ).toBeInTheDocument();
    expect(screen.queryByText("No buildings yet.")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Add owner" })
    ).not.toBeInTheDocument();
  });
});
