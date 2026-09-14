import { render, screen } from "@testing-library/react-native";

import PersonAvatar from "./PersonAvatar";

describe("PersonAvatar", () => {
  it("shows initials from the display name", () => {
    render(<PersonAvatar displayName="Yaw Darko" />);

    expect(screen.getByText("YD")).toBeTruthy();
    expect(screen.getByLabelText("Yaw Darko")).toBeTruthy();
  });
});
