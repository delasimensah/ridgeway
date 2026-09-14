import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import TenantRentInvoiceRow from "./TenantRentInvoiceRow";

describe("TenantRentInvoiceRow", () => {
  it("lets the tenant mark a payment as reported", async () => {
    const user = userEvent.setup();
    const onReport = jest.fn();
    render(
      <TenantRentInvoiceRow
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

    expect(screen.getByText("September 2026")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 4,500")).toBeInTheDocument();
    expect(screen.getByText("Late")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "I have paid" }));
    expect(onReport).toHaveBeenCalledTimes(1);
  });
});
