import { fireEvent, render, screen } from "@testing-library/react-native";

import TenantRentScreen from "./TenantRentScreen";

describe("TenantRentScreen", () => {
  it("shows the current reminder and reports a payment", () => {
    const onReport = jest.fn();
    render(
      <TenantRentScreen
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
            confirmedAmount: null,
            tenantReportedAt: null,
          },
          {
            _id: "rent-2",
            periodLabel: "2026-08",
            amount: 450000,
            currency: "GHS",
            dueOn: "2026-08-05",
            confirmedStatus: "paid",
            confirmedAmount: 450000,
            tenantReportedAt: Date.UTC(2026, 7, 2),
          },
        ]}
      />
    );

    expect(screen.getByText("Rent")).toBeTruthy();
    expect(screen.getByText("September 2026")).toBeTruthy();
    expect(screen.getByText("August 2026")).toBeTruthy();
    fireEvent.press(screen.getByText("I have paid"));
    expect(onReport).toHaveBeenCalledWith("rent-1");
  });
});
