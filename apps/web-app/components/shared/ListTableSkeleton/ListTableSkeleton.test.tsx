import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import ListTableSkeleton from "./ListTableSkeleton";

describe("ListTableSkeleton", () => {
  it("keeps list chrome while rows load", () => {
    render(<ListTableSkeleton label="Loading buildings" />);

    expect(screen.getByLabelText("Loading buildings")).toBeInTheDocument();
  });
});
