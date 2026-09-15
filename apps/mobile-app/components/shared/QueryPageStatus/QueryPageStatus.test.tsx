import { render, screen } from "@testing-library/react-native";

import QueryPageStatus from "./QueryPageStatus";

describe("QueryPageStatus", () => {
  it("shows a skeleton while the page loads", () => {
    render(
      <QueryPageStatus
        loadState="loading"
        failedTitle="Couldn't load this page."
      >
        Form
      </QueryPageStatus>
    );

    expect(screen.getByLabelText("Loading page")).toBeTruthy();
    expect(screen.queryByText("Form")).toBeNull();
  });
});
