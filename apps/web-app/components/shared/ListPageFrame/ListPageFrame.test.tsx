import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import ListPageFrame from "./ListPageFrame";

describe("ListPageFrame", () => {
  it("keeps the heading and shows a skeleton while the list loads", () => {
    render(
      <ListPageFrame
        title="Buildings"
        loadState="loading"
        failedTitle="Couldn't load buildings."
        skeletonLabel="Loading buildings"
        actionHref="/buildings/new"
        actionLabel="Add building"
        isEmpty
        empty={<p>No buildings yet.</p>}
      >
        <p>Rows</p>
      </ListPageFrame>
    );

    expect(
      screen.getByRole("heading", { name: "Buildings" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Loading buildings")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add building" })).toBeDisabled();
    expect(screen.queryByText("Rows")).not.toBeInTheDocument();
  });
});
