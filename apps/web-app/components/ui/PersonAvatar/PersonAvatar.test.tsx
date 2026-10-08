import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import PersonAvatar from "./PersonAvatar";

describe("PersonAvatar", () => {
  it("shows a picture for the person", () => {
    render(<PersonAvatar displayName="Ama Boateng" />);

    expect(screen.getByRole("img", { name: "Ama Boateng" })).toHaveAttribute(
      "src",
      expect.stringMatching(/^\/look\/people\//)
    );
  });
});
