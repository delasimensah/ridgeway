import { fireEvent, render, screen } from "@testing-library/react-native";

import TenantNextRentCard from "./TenantNextRentCard";

describe("TenantNextRentCard", () => {
  it("shows the reminder and opens rent", () => {
    const onManageRent = jest.fn();
    render(
      <TenantNextRentCard
        amount={450000}
        currency="GHS"
        dueOn="2026-09-05"
        confirmedStatus="unpaid"
        serverNow={Date.UTC(2026, 8, 13)}
        onManageRent={onManageRent}
      />
    );

    expect(screen.getByText("GH₵ 4,500")).toBeTruthy();
    fireEvent.press(screen.getByText("Manage Rent"));
    expect(onManageRent).toHaveBeenCalledTimes(1);
  });
});
