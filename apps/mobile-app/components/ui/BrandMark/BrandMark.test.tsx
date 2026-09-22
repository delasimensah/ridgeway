import { render, screen } from "@testing-library/react-native";

import BrandMark from "./BrandMark";

describe("BrandMark", () => {
  it("exposes Ridgeway as the accessible name", () => {
    render(
      <BrandMark
        size="header"
        textClassName="font-app-bold text-xl text-darkGrey"
      />
    );

    expect(screen.getByLabelText("Ridgeway")).toBeTruthy();
    expect(screen.getByText("Ridgeway")).toBeTruthy();
  });
});
