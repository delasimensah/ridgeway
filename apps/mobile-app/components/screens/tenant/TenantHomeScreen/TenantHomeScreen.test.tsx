import { fireEvent, render, screen } from "@testing-library/react-native";

import TenantHomeScreen from "./TenantHomeScreen";

describe("TenantHomeScreen", () => {
  it("shows the unit and next rent", () => {
    const onManageRent = jest.fn();
    render(
      <TenantHomeScreen
        unitLabel="B12"
        buildingName="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        serverNow={Date.UTC(2026, 8, 13)}
        nextRent={{
          amount: 450000,
          currency: "GHS",
          dueOn: "2026-09-05",
          confirmedStatus: "unpaid",
        }}
        repairs={[
          { _id: "wo-1", title: "Kitchen tap leak", status: "received" },
        ]}
        onManageRent={onManageRent}
      />
    );

    expect(screen.getByText("B12 · Ridge Court")).toBeTruthy();
    expect(screen.getByText("GH₵ 4,500")).toBeTruthy();
    expect(screen.getByText("Kitchen tap leak")).toBeTruthy();
    fireEvent.press(screen.getByText("Manage Rent"));
    expect(onManageRent).toHaveBeenCalledTimes(1);
  });
});
