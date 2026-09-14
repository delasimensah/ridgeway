import { fireEvent, render, screen } from "@testing-library/react-native";

import AccountScreen from "./AccountScreen";

describe("AccountScreen", () => {
  it("shows the field worker and signs out", () => {
    const onSignOut = jest.fn();
    render(
      <AccountScreen
        displayName="Yaw Darko"
        isSigningOut={false}
        onSignOut={onSignOut}
      />
    );
    expect(screen.getByText("Yaw Darko")).toBeTruthy();
    expect(screen.getByText("YD")).toBeTruthy();
    expect(screen.getByText("Field worker")).toBeTruthy();
    fireEvent.press(screen.getByText("Sign out"));
    expect(onSignOut).toHaveBeenCalled();
  });
});
