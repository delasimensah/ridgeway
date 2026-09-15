import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import QueryPageStatus from "./QueryPageStatus";

describe("QueryPageStatus", () => {
  it("shows a skeleton while the page loads", () => {
    render(
      <QueryPageStatus
        loadState="loading"
        failedTitle="Couldn't load this page."
      >
        <p>Form</p>
      </QueryPageStatus>
    );

    expect(screen.getByLabelText("Loading page")).toBeInTheDocument();
    expect(screen.queryByText("Form")).not.toBeInTheDocument();
  });
});
