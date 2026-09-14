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
};

function renderPage(
  props: Partial<React.ComponentProps<typeof StaffRentPage>>
) {
  return render(
    <StaffRentPage
      periodLabel="2026-09"
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

    expect(
      screen.getByRole("heading", { name: "Rent · September 2026" })
    ).toBeInTheDocument();
    expect(screen.getByText("Akosua Darko")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Late" }));
    expect(onStatusFilterChange).toHaveBeenCalledWith("late");
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
