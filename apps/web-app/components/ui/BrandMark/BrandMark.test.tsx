import { screen } from "@testing-library/react";

import { ASSETS } from "@/constants";
import { render } from "@/test-utils";

import BrandMark from "./BrandMark";

describe("BrandMark", () => {
  it("shows the logo and Ridgeway wordmark", () => {
    render(
      <BrandMark
        size="nav"
        headingClassName="mb-0 text-[24px] font-bold text-darkGrey"
      />
    );

    expect(screen.getByRole("heading", { name: "Ridgeway" })).toBeTruthy();
    const logo = screen.getByRole("presentation");
    expect(logo).toHaveAttribute("src", ASSETS.icons.logo);
  });
});
