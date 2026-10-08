import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import NotFoundPage from "./NotFoundPage";

describe("NotFoundPage", () => {
  it("sends the person back to Ridgeway", () => {
    render(<NotFoundPage />);

    expect(
      screen.getByRole("heading", { name: /this page isn't here/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to ridgeway/i })
    ).toHaveAttribute("href", "/");
  });
});
