import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import WritesLockedNote from "./WritesLockedNote";

describe("WritesLockedNote", () => {
  it("says that this demo cannot save changes", () => {
    render(<WritesLockedNote />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "This demo can't save changes."
    );
  });
});
