import { render, screen } from "@testing-library/react-native";

import TextField from "./TextField";

describe("TextField", () => {
  it("renders the label", () => {
    render(<TextField label="Email address" />);
    expect(screen.getByText("Email address")).toBeTruthy();
  });
});
