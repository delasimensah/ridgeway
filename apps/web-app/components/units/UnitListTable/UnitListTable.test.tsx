import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import UnitListTable from "./UnitListTable";

describe("UnitListTable", () => {
  it("renders a row for each unit", () => {
    render(
      <UnitListTable
        buildingId="building-1"
        units={[
          { _id: "1", label: "A3" },
          { _id: "2", label: "B12" },
        ]}
      />
    );

    expect(screen.getByText("A3")).toBeInTheDocument();
    expect(screen.getByText("B12")).toBeInTheDocument();
    expect(screen.getByText("Unit")).toBeInTheDocument();
    expect(screen.getByText("Lease ends")).toBeInTheDocument();
  });
});
