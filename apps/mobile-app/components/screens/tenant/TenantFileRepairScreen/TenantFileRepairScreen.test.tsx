import { fireEvent, render, screen } from "@testing-library/react-native";

import TenantFileRepairScreen from "./TenantFileRepairScreen";

describe("TenantFileRepairScreen", () => {
  it("submits a repair without a photo", () => {
    const onSubmit = jest.fn();
    render(
      <TenantFileRepairScreen
        buildingName="Ridge Court"
        unitLabel="B12"
        description="Kitchen tap leak"
        category="plumbing"
        urgency="normal"
        photoUri={null}
        isSubmitting={false}
        error={null}
        onChangeDescription={() => undefined}
        onChangeCategory={() => undefined}
        onChangeUrgency={() => undefined}
        onPickPhoto={() => undefined}
        onSubmit={onSubmit}
        onBack={() => undefined}
      />
    );

    expect(screen.getByText("Ridge Court · B12")).toBeTruthy();
    expect(screen.getByText("Add a photo")).toBeTruthy();
    fireEvent.press(screen.getByText("Submit repair"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
