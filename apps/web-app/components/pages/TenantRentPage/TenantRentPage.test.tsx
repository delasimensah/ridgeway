import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import TenantRentPage from "./TenantRentPage";

describe("TenantRentPage", () => {
  it("shows the current reminder and reports a payment", async () => {
    const user = userEvent.setup();
    const onReport = jest.fn();
    render(
      <TenantRentPage
        buildingName="Ridge Court"
        unitLabel="B12"
        serverNow={Date.UTC(2026, 8, 13)}
        onReport={onReport}
        periods={[
          {
            _id: "rent-1",
            periodLabel: "2026-09",
            amount: 450000,
            currency: "GHS",
            dueOn: "2026-09-05",
            confirmedStatus: "unpaid",
            tenantReportedAt: null,
          },
          {
            _id: "rent-2",
            periodLabel: "2026-08",
            amount: 450000,
            currency: "GHS",
            dueOn: "2026-08-05",
            confirmedStatus: "paid",
            tenantReportedAt: Date.UTC(2026, 7, 2),
          },
        ]}
      />
    );

    expect(screen.getByRole("heading", { name: "Rent" })).toBeInTheDocument();
    expect(screen.getByText("Ridge Court · B12")).toBeInTheDocument();
    expect(screen.getByText("September 2026")).toBeInTheDocument();
    expect(screen.getByText("August 2026")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "I have paid" }));
    expect(onReport).toHaveBeenCalledWith("rent-1");
  });

  it("keeps the rent heading and invoices section while rent loads", () => {
    render(
      <TenantRentPage
        loadState="loading"
        buildingName="Ridge Court"
        unitLabel="B12"
        serverNow={0}
        onReport={() => undefined}
        periods={[]}
      />
    );

    expect(screen.getByRole("heading", { name: "Rent" })).toBeInTheDocument();
    expect(screen.getByText("Ridge Court · B12")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Invoices" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Loading invoices")).toBeInTheDocument();
    expect(screen.queryByText("No open rent.")).not.toBeInTheDocument();
  });
});
