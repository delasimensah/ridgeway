import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import RepairListTable from "./RepairListTable";

describe("RepairListTable", () => {
  it("renders a row that opens the ticket", () => {
    render(
      <RepairListTable
        repairs={[
          {
            _id: "wo-1",
            title: "Kitchen tap leak",
            status: "received",
            unitLabel: "B12",
            buildingName: "Ridge Court",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("link", { name: "Kitchen tap leak" })
    ).toHaveAttribute("href", "/repairs/wo-1");
    expect(screen.getByText("Ridge Court")).toBeInTheDocument();
    expect(screen.getByText("B12")).toBeInTheDocument();
    expect(screen.getByText("RECEIVED")).toBeInTheDocument();
  });
});
