import { screen } from "@testing-library/react";

import { fillField, render, setupUser } from "@/test-utils";

import StaffRentPage from "./StaffRentPage";

const PERIOD = {
  _id: "rent-1",
  unitLabel: "B12",
  tenantName: "Akosua Darko",
  amount: 450000,
  currency: "GHS" as const,
  dueOn: "2026-09-05",
  confirmedStatus: "unpaid" as const,
  confirmedAmount: null,
  tenantReportedAt: null,
  arrears: 0,
};

function renderPage(
  props: Partial<React.ComponentProps<typeof StaffRentPage>>
) {
  return render(
    <StaffRentPage
      periodLabel="2026-09"
      earliestPeriodLabel="2026-07"
      onPeriodLabelChange={jest.fn()}
      buildings={[{ _id: "b1", name: "Ridge Court" }]}
      buildingId="b1"
      onBuildingIdChange={jest.fn()}
      collected={0}
      outstanding={450000}
      currency="GHS"
      serverNow={Date.UTC(2026, 8, 13)}
      statusFilter="all"
      onStatusFilterChange={jest.fn()}
      onSetStatus={jest.fn()}
      periods={[PERIOD]}
      {...props}
    />
  );
}

describe("StaffRentPage", () => {
  it("shows this month and lets staff filter to late", async () => {
    const user = setupUser();
    const onStatusFilterChange = jest.fn();
    renderPage({ onStatusFilterChange });

    expect(screen.getByRole("heading", { name: "Rent" })).toBeInTheDocument();
    expect(screen.getByText("September")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Year" })).toHaveValue("2026");
    expect(screen.getByText("Akosua Darko")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Late" }));
    expect(onStatusFilterChange).toHaveBeenCalledWith("late");
  });

  it("lets staff step back a month and blocks the future", async () => {
    const user = setupUser();
    const onPeriodLabelChange = jest.fn();
    renderPage({ onPeriodLabelChange });

    await user.click(screen.getByRole("button", { name: "Previous month" }));
    expect(onPeriodLabelChange).toHaveBeenCalledWith("2026-08");
    expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
  });

  it("lets staff jump to another year inside the charged range", async () => {
    const user = setupUser();
    const onPeriodLabelChange = jest.fn();
    renderPage({
      onPeriodLabelChange,
      earliestPeriodLabel: "2025-07",
      periodLabel: "2026-09",
    });

    await user.click(screen.getByRole("combobox", { name: "Year" }));
    await user.click(
      await screen.findByRole("option", { name: "2025", hidden: true })
    );
    expect(onPeriodLabelChange).toHaveBeenCalledWith("2025-09");
  });

  it("keeps the rent chrome and shows skeletons while rent data loads", () => {
    renderPage({ isLoading: true, periods: [] });

    expect(screen.getByRole("heading", { name: "Rent" })).toBeInTheDocument();
    expect(screen.getByText("September")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading rent summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading rent list")).toBeInTheDocument();
    expect(screen.queryByText("Akosua Darko")).not.toBeInTheDocument();
    expect(screen.queryByText("Collected")).not.toBeInTheDocument();
  });

  it("counts tenants waiting on confirmation and filters to them", async () => {
    const user = setupUser();
    const onStatusFilterChange = jest.fn();
    renderPage({
      onStatusFilterChange,
      periods: [{ ...PERIOD, tenantReportedAt: Date.UTC(2026, 8, 12) }],
    });

    await user.click(screen.getByRole("button", { name: "Reported (1)" }));
    expect(onStatusFilterChange).toHaveBeenCalledWith("reported");
  });

  it("asks staff how much was received before recording a partial payment", async () => {
    const user = setupUser();
    const onSetStatus = jest.fn();
    renderPage({ onSetStatus });

    await user.click(
      screen.getByRole("combobox", { name: "Confirm rent for B12" })
    );
    await user.click(
      await screen.findByRole("option", { name: /^Partial$/i, hidden: true })
    );

    await fillField(user, screen.getByLabelText(/amount received/i), "2000");
    await user.click(
      screen.getByRole("button", { name: "Save partial payment" })
    );

    expect(onSetStatus).toHaveBeenCalledWith("rent-1", "partial", 200000);
  });
});
