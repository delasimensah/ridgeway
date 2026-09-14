import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffRentTable from "./StaffRentTable";

describe("StaffRentTable", () => {
  it("lists units and tenants", () => {
    render(
      <StaffRentTable
        serverNow={Date.UTC(2026, 8, 13)}
        onSetStatus={jest.fn()}
        onRequestPartial={jest.fn()}
        periods={[
          {
            _id: "rent-1",
            unitLabel: "B12",
            tenantName: "Akosua Darko",
            amount: 450000,
            currency: "GHS",
            dueOn: "2026-09-05",
            confirmedStatus: "unpaid",
            confirmedAmount: null,
            tenantReportedAt: null,
          },
        ]}
      />
    );

    expect(screen.getByText("B12")).toBeInTheDocument();
    expect(screen.getByText("Akosua Darko")).toBeInTheDocument();
  });
});
