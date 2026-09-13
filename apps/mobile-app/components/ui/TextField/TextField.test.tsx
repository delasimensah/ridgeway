import { fireEvent, render, screen } from "@testing-library/react-native";

import TextField from "./TextField";

describe("TextField", () => {
  it("renders the label", () => {
    render(<TextField label="Email address" />);
    expect(screen.getByText("Email address")).toBeTruthy();
  });

  it("shows and hides a password", () => {
    render(<TextField label="Password" secureTextEntry />);
    expect(screen.getByLabelText("Show password")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Show password"));
    expect(screen.getByLabelText("Hide password")).toBeTruthy();
  });
});
