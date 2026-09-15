import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerBuildingSnapshotPage from "./OwnerBuildingSnapshotPage";

describe("OwnerBuildingSnapshotPage", () => {
  it("shows occupancy, open issues, and this month's rent for the building", () => {
    render(
      <OwnerBuildingSnapshotPage
        name="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        occupiedCount={1}
        unitCount={2}
        openRepairCount={1}
        collected={0}
        currency="GHS"
        issues={[
          {
            _id: "wo-1",
            title: "B12 leak",
            status: "received",
            tenantName: "Akosua Darko",
            unitKind: "apartment",
          },
        ]}
        periods={[
          {
            _id: "r1",
            unitLabel: "B12",
            tenantName: "Akosua Darko",
            amount: 450000,
            currency: "GHS",
            confirmedStatus: "unpaid",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Ridge Court" })
    ).toBeInTheDocument();
    expect(screen.getByText("of 2 units")).toBeInTheDocument();
    expect(screen.getByText("B12 leak")).toBeInTheDocument();
    expect(screen.getByText("Tenant: Akosua Darko")).toBeInTheDocument();
    expect(screen.getByText("Outstanding")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(
      screen.getByRole("link", { name: /view all issues/i })
    ).toHaveAttribute("href", "/repairs");
    expect(screen.queryByText("Add unit")).not.toBeInTheDocument();
  });
});
