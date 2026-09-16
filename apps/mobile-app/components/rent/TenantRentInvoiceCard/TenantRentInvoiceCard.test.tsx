import { fireEvent, render, screen } from "@testing-library/react-native";

import TenantRentInvoiceCard from "./TenantRentInvoiceCard";

describe("TenantRentInvoiceCard", () => {
  it("lets the tenant mark a payment as reported", () => {
    const onReport = jest.fn();
    render(
      <TenantRentInvoiceCard
        periodLabel="2026-09"
        amount={450000}
        currency="GHS"
        dueOn="2026-09-05"
        confirmedStatus="unpaid"
        tenantReportedAt={null}
        confirmedAmount={null}
        serverNow={Date.UTC(2026, 8, 13)}
        onReport={onReport}
      />
    );

    expect(screen.getByText("September 2026")).toBeTruthy();
    expect(screen.getByText("GH₵ 4,500")).toBeTruthy();
    fireEvent.press(screen.getByText("I have paid"));
    expect(onReport).toHaveBeenCalledTimes(1);
  });

  it("shows what a partial payment received and still owes", () => {
    render(
      <TenantRentInvoiceCard
        periodLabel="2026-09"
        amount={450000}
        currency="GHS"
        dueOn="2026-09-05"
        confirmedStatus="partial"
        confirmedAmount={200000}
        tenantReportedAt={Date.UTC(2026, 8, 2)}
        serverNow={Date.UTC(2026, 8, 13)}
        onReport={jest.fn()}
      />
    );

    expect(
      screen.getByText("GH₵ 2,000 received · GH₵ 2,500 still owed")
    ).toBeTruthy();
    expect(screen.queryByText("I have paid")).toBeNull();
    expect(screen.queryByText(/staff still confirm this/i)).toBeNull();
  });
});
