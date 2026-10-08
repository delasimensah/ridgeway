import { fireEvent, render, screen } from "@testing-library/react-native";

import AccountScreen from "./AccountScreen";

describe("AccountScreen", () => {
  it("confirms before signing out", () => {
    const onSignOut = jest.fn();
    render(
      <AccountScreen
        displayName="Yaw Darko"
        roleLabel="Field worker"
        isSigningOut={false}
        onSignOut={onSignOut}
      />
    );
    expect(screen.getByText("Yaw Darko")).toBeTruthy();
    expect(screen.getByLabelText("Yaw Darko")).toBeTruthy();
    expect(screen.getByText("Field worker")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Sign out"));
    expect(onSignOut).not.toHaveBeenCalled();
    fireEvent.press(screen.getByLabelText("Confirm sign out"));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
