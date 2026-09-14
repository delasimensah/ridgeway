import { render, screen } from "@testing-library/react-native";

import TenantLeaseEndedScreen from "./TenantLeaseEndedScreen";

describe("TenantLeaseEndedScreen", () => {
  it("names the ended unit", () => {
    render(
      <TenantLeaseEndedScreen
        unitLabel="B12"
        buildingName="Ridge Court"
        isSigningOut={false}
        onSignOut={() => undefined}
      />
    );

    expect(
      screen.getByText("You no longer have access to this unit")
    ).toBeTruthy();
    expect(
      screen.getByText(/The lease for Ridge Court B12 has ended/i)
    ).toBeTruthy();
  });
});
