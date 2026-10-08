import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffRepairsPage from "./StaffRepairsPage";

describe("StaffRepairsPage", () => {
  it("lists repairs", () => {
    render(
      <StaffRepairsPage
        repairs={[
          {
            _id: "wo-1",
            title: "Kitchen tap leak",
            status: "received",
            unitLabel: "B12",
            buildingName: "Ridge Court",
            assigneeName: null,
          },
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Repairs" })
    ).toBeInTheDocument();
    expect(screen.getByText("Kitchen tap leak")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add repair" })
    ).not.toBeInTheDocument();
  });

  it("shows an empty state when there are none", () => {
    render(<StaffRepairsPage repairs={[]} />);
    expect(
      screen.getByRole("heading", { name: "Nothing open right now." })
    ).toBeInTheDocument();
  });
});
