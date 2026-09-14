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
        serverNow={Date.UTC(2026, 8, 13)}
        onReport={onReport}
      />
    );

    expect(screen.getByText("September 2026")).toBeTruthy();
    expect(screen.getByText("GH₵ 4,500")).toBeTruthy();
    fireEvent.press(screen.getByText("I have paid"));
    expect(onReport).toHaveBeenCalledTimes(1);
  });
});
