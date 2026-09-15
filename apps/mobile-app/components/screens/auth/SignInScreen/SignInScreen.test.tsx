import { render, screen } from "@testing-library/react-native";

import SignInScreen from "./SignInScreen";

jest.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({ signIn: jest.fn() }),
}));

describe("SignInScreen", () => {
  it("shows the field and tenant sign-in copy", () => {
    render(<SignInScreen />);
    expect(screen.getByText("Ridgeway")).toBeTruthy();
    expect(screen.getByText("Sign in")).toBeTruthy();
    expect(
      screen.getByText("Tenants and field staff use this app.")
    ).toBeTruthy();
  });
});
