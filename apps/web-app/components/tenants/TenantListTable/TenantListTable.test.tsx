import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import TenantListTable from "./TenantListTable";

describe("TenantListTable", () => {
  it("renders a row for each tenant", () => {
    render(
      <TenantListTable
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
          {
            _id: "2",
            leaseId: "lease-2",
            buildingId: "building-1",
            displayName: "Sofia Herrera",
            email: "sofia.herrera@example.com",
            hasLogin: false,
            currentBuildingName: null,
            currentUnitLabel: null,
          },
        ]}
      />
    );

    expect(screen.getByText("Akosua Darko")).toBeInTheDocument();
    expect(screen.getByText("Sofia Herrera")).toBeInTheDocument();
    expect(screen.getByText("Ridge Court · B12")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Can sign in")).toBeInTheDocument();
  });
});
