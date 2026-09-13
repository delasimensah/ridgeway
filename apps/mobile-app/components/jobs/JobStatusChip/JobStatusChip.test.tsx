import { render, screen } from "@testing-library/react-native";

import JobStatusChip from "./JobStatusChip";

describe("JobStatusChip", () => {
  it("shows the assigned label", () => {
    render(<JobStatusChip status="assigned" />);
    expect(screen.getByText("Assigned")).toBeTruthy();
  });
});
