import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerSnapshotMetricCard from "./OwnerSnapshotMetricCard";

describe("OwnerSnapshotMetricCard", () => {
  it("shows occupancy as occupied of total units", () => {
    render(
      <OwnerSnapshotMetricCard label="Occupancy" value="1" hint="of 2 units" />
    );

    expect(screen.getByText("Occupancy")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("of 2 units")).toBeInTheDocument();
  });
});
