import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import RepairListTable from "./RepairListTable";

describe("RepairListTable", () => {
  it("renders a row that opens the ticket and shows who it is assigned to", () => {
    render(
      <RepairListTable
        repairs={[
          {
            _id: "wo-1",
            title: "Kitchen tap leak",
            status: "assigned",
            unitLabel: "B12",
            buildingName: "Ridge Court",
            assigneeName: "Yaw Darko",
          },
          {
            _id: "wo-2",
            title: "Shop 2 AC",
            status: "received",
            unitLabel: "Shop 2",
            buildingName: "Ridge Court",
            assigneeName: null,
          },
        ]}
      />
    );

    expect(
      screen.getByRole("link", { name: "Kitchen tap leak" })
    ).toHaveAttribute("href", "/repairs/wo-1");
    expect(screen.getByText("Yaw Darko")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("Assigned")).toBeInTheDocument();
  });
});
