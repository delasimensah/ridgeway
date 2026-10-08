import { render, screen } from "@testing-library/react-native";

import PersonAvatar from "./PersonAvatar";

describe("PersonAvatar", () => {
  it("shows a portrait labeled with the display name", () => {
    render(<PersonAvatar displayName="Yaw Darko" />);

    expect(screen.getByLabelText("Yaw Darko")).toHaveStyle({
      backgroundColor: "#1A3636",
    });
    expect(screen.queryByText("YD")).toBeNull();
  });
});
