import { render, screen } from "@testing-library/react-native";

import RentStatusChip from "./RentStatusChip";

describe("RentStatusChip", () => {
  it("shows the displayed status", () => {
    render(<RentStatusChip status="late" />);
    expect(screen.getByText("Late")).toBeTruthy();
  });
});
