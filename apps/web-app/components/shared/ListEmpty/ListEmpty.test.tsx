import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import ListEmpty from "./ListEmpty";

describe("ListEmpty", () => {
  it("shows a next action when the person can add", () => {
    render(
      <ListEmpty
        title="No buildings yet."
        description="Get started by adding your first property."
        actionHref="/buildings/new"
        actionLabel="Add building"
      />
    );

    expect(
      screen.getByRole("heading", { name: "No buildings yet." })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add building" })).toHaveAttribute(
      "href",
      "/buildings/new"
    );
  });
});
