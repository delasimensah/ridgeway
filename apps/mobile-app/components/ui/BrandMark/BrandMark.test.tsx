import { render, screen } from "@testing-library/react-native";

import BrandMark from "./BrandMark";

describe("BrandMark", () => {
  it("can show the logo without the wordmark", () => {
    render(<BrandMark size="header" showWordmark={false} />);

    expect(screen.getByLabelText("Ridgeway")).toBeTruthy();
    expect(screen.queryByText("Ridgeway")).toBeNull();
  });
});
