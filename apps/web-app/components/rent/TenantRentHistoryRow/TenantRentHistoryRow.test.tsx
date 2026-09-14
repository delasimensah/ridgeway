import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import TenantRentHistoryRow from "./TenantRentHistoryRow";

describe("TenantRentHistoryRow", () => {
  it("shows a paid month", () => {
    render(
      <TenantRentHistoryRow
        periodLabel="2026-08"
        amount={450000}
        currency="GHS"
        status="paid"
      />
    );

    expect(screen.getByText("August 2026")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 4,500")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });
});
