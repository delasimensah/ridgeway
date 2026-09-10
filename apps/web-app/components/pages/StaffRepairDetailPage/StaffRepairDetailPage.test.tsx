import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffRepairDetailPage from "./StaffRepairDetailPage";

describe("StaffRepairDetailPage", () => {
  it("shows the ticket without assign or schedule", () => {
    render(
      <StaffRepairDetailPage
        title="Kitchen tap leak"
        description="The tap drips."
        status="received"
        category="plumbing"
        unitLabel="B12"
        buildingName="Ridge Court"
        buildingId="building-1"
        tenantName="Akosua Darko"
        reportedAt={Date.UTC(2026, 7, 22)}
        photoUrls={[]}
        events={[
          {
            _id: "ev-1",
            toStatus: "received",
            actorName: "Akosua Darko",
            createdAt: Date.UTC(2026, 7, 22),
          },
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Repair: Kitchen tap leak" })
    ).toBeInTheDocument();
    expect(screen.getByText("Akosua Darko")).toBeInTheDocument();
    expect(screen.getByText("The tap drips.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Assign" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Schedule" })
    ).not.toBeInTheDocument();
  });
});
