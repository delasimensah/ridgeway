import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffTenantsPage from "./StaffTenantsPage";

describe("StaffTenantsPage", () => {
  it("lists tenants", () => {
    render(
      <StaffTenantsPage
        tenants={[
          {
            _id: "1",
            leaseId: "lease-1",
            buildingId: "building-1",
            displayName: "Akosua Darko",
            email: "akosua@example.com",
            hasLogin: true,
            currentBuildingName: "Ridge Court",
            currentUnitLabel: "B12",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Tenants" })
    ).toBeInTheDocument();
    expect(screen.getByText("Akosua Darko")).toBeInTheDocument();
    expect(screen.getByText("Ridge Court · B12")).toBeInTheDocument();
    expect(screen.queryByText("No tenants yet.")).not.toBeInTheDocument();
  });

  it("shows an empty line when there are none", () => {
    render(<StaffTenantsPage tenants={[]} />);
    expect(screen.getByText("No tenants yet.")).toBeInTheDocument();
  });
});
