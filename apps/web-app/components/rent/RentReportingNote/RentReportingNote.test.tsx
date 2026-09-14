import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import RentReportingNote from "./RentReportingNote";

describe("RentReportingNote", () => {
  it("says staff still confirm the payment", () => {
    render(<RentReportingNote />);
    expect(screen.getByText("Payment reporting")).toBeInTheDocument();
    expect(
      screen.getByText(/Ridgeway staff still confirm this/i)
    ).toBeInTheDocument();
  });
});
