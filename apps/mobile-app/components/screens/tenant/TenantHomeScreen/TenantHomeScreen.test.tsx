import { fireEvent, render, screen } from "@testing-library/react-native";

import TenantHomeScreen from "./TenantHomeScreen";

describe("TenantHomeScreen", () => {
  it("shows the unit, next rent, and file a repair", () => {
    const onManageRent = jest.fn();
    const onFileRepair = jest.fn();
    const onOpenRepair = jest.fn();
    render(
      <TenantHomeScreen
        displayName="Akosua Darko"
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
          {
            _id: "wo-1",
            title: "Kitchen tap leak",
            status: "received",
            category: "plumbing",
            urgency: "high",
          },
        ]}
        onManageRent={onManageRent}
        onFileRepair={onFileRepair}
        onOpenRepair={onOpenRepair}
      />
    );

    expect(screen.getByText("B12 · Ridge Court")).toBeTruthy();
    expect(screen.getByText("GH₵ 4,500")).toBeTruthy();
    expect(screen.getByText("Kitchen tap leak")).toBeTruthy();
    fireEvent.press(screen.getByText("Manage Rent"));
    expect(onManageRent).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByLabelText("File a repair"));
    expect(onFileRepair).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByLabelText("Kitchen tap leak"));
    expect(onOpenRepair).toHaveBeenCalledWith("wo-1");
  });
});
