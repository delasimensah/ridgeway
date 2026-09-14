import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import RentStatusBadge from "./RentStatusBadge";

describe("RentStatusBadge", () => {
  it("shows the displayed status", () => {
    render(<RentStatusBadge status="late" />);
    expect(screen.getByText("Late")).toBeInTheDocument();
  });
});
