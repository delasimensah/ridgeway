import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import PageContentSkeleton from "./PageContentSkeleton";

describe("PageContentSkeleton", () => {
  it("shows a quiet skeleton in the existing chrome", () => {
    render(<PageContentSkeleton />);

    expect(screen.getByLabelText("Loading page")).toBeInTheDocument();
  });
});
