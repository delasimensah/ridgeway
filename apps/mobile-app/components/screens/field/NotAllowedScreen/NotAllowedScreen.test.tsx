import { render, screen } from "@testing-library/react-native";

import NotAllowedScreen from "./NotAllowedScreen";

describe("NotAllowedScreen", () => {
  it("explains that this app is not for this login", () => {
    render(
      <NotAllowedScreen isSigningOut={false} onSignOut={() => undefined} />
    );
    expect(
      screen.getByText("You don’t have permission to see this page.")
    ).toBeTruthy();
  });
});
