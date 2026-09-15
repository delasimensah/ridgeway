import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerRentBreakdownTable from "./OwnerRentBreakdownTable";

describe("OwnerRentBreakdownTable", () => {
  it("lists collected versus outstanding per building", () => {
    render(
      <OwnerRentBreakdownTable
        collected={450000}
        outstanding={0}
        currency="GHS"
        buildings={[
          {
            buildingId: "b1",
            name: "Ridge Court",
            address: "14 Ridge Road, Cantonments, Accra",
            collected: 450000,
            outstanding: 0,
          },
        ]}
      />
    );

    expect(screen.getByText("Ridge Court")).toBeInTheDocument();
    expect(
      screen.getByText("14 Ridge Road, Cantonments, Accra")
    ).toBeInTheDocument();
    expect(screen.getAllByText("GH₵ 4,500")).toHaveLength(2);
    expect(screen.getByText("Total Portfolio")).toBeInTheDocument();
  });
});
