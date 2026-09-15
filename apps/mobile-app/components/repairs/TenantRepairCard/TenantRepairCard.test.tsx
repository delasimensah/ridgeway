import { fireEvent, render, screen } from "@testing-library/react-native";

import TenantRepairCard from "./TenantRepairCard";

describe("TenantRepairCard", () => {
  it("shows status and opens the timeline", () => {
    const onPress = jest.fn();
    render(
      <TenantRepairCard
        repair={{
          _id: "wo-1",
          title: "Kitchen tap leak",
          status: "assigned",
          category: "plumbing",
          urgency: "high",
        }}
        onPress={onPress}
      />
    );

    expect(screen.getByText("Kitchen tap leak")).toBeTruthy();
    expect(screen.getByText("Plumbing · High Urgency")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Kitchen tap leak"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
