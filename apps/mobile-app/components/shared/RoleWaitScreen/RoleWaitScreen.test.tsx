import { render, screen } from "@testing-library/react-native";

import RoleWaitScreen from "./RoleWaitScreen";

describe("RoleWaitScreen", () => {
  it("shows the logo and a spinner, not the Ridgeway wordmark", () => {
    render(<RoleWaitScreen />);

    expect(screen.getByRole("header", { name: "Ridgeway" })).toBeTruthy();
    expect(screen.getByLabelText("Loading")).toBeTruthy();
    expect(screen.queryByText("Ridgeway")).toBeNull();
    expect(screen.queryByText("Loading...")).toBeNull();
  });
});
