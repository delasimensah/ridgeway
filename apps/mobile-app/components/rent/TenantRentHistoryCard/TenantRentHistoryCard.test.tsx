import { render, screen } from "@testing-library/react-native";

import TenantRentHistoryCard from "./TenantRentHistoryCard";

describe("TenantRentHistoryCard", () => {
  it("shows a paid month as done", () => {
    render(
      <TenantRentHistoryCard
        periodLabel="2026-08"
        amount={450000}
        currency="GHS"
      />
    );

    expect(screen.getByText("August 2026")).toBeTruthy();
    expect(screen.getByText("GH₵ 4,500")).toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();
  });
});
