import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import PersonAvatar from "./PersonAvatar";

describe("PersonAvatar", () => {
  it("shows initials from the display name", () => {
    render(<PersonAvatar displayName="Ama Boateng" />);

    expect(screen.getByText("AB")).toBeInTheDocument();
    expect(screen.getByTitle("Ama Boateng")).toBeInTheDocument();
  });
});
