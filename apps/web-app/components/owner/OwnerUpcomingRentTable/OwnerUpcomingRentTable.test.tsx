import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerUpcomingRentTable from "./OwnerUpcomingRentTable";

describe("OwnerUpcomingRentTable", () => {
  it("marks paid rent collected and unpaid rent outstanding", () => {
    render(
      <OwnerUpcomingRentTable
        periods={[
          {
            _id: "r1",
            unitLabel: "B12",
            tenantName: "Akosua Darko",
            amount: 450000,
            currency: "GHS",
            confirmedStatus: "unpaid",
          },
          {
            _id: "r2",
            unitLabel: "A2",
            tenantName: "Kojo Antwi",
            amount: 280000,
            currency: "GHS",
            confirmedStatus: "paid",
          },
        ]}
      />
    );

    expect(screen.getByText("B12")).toBeInTheDocument();
    expect(screen.getByText("Akosua Darko")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 4,500")).toBeInTheDocument();
    expect(screen.getByText("Outstanding")).toBeInTheDocument();
    expect(screen.getByText("Collected")).toBeInTheDocument();
  });
});
