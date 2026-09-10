import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import BuildingDetailPage from "./BuildingDetailPage";

describe("BuildingDetailPage", () => {
  it("shows the empty next action when there are no units", () => {
    render(
      <BuildingDetailPage
        buildingId="building-1"
        name="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        units={[]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Ridge Court" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "No units yet." })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Add unit" }).length).toBe(2);
    expect(
      screen.queryByRole("link", { name: "Add tenant" })
    ).not.toBeInTheDocument();
  });

  it("shows saved units under the building", () => {
    render(
      <BuildingDetailPage
        buildingId="building-1"
        name="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        units={[{ _id: "1", label: "A3" }]}
      />
    );

    expect(screen.getByText("A3")).toBeInTheDocument();
    expect(screen.queryByText("No units yet.")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add tenant" })).toHaveAttribute(
      "href",
      "/buildings/building-1/tenants/new"
    );
  });

  it("hides add tenant when every unit already has a tenant", () => {
    render(
      <BuildingDetailPage
        buildingId="building-1"
        name="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        units={[
          {
            _id: "1",
            label: "A3",
            tenantName: "Sofia Herrera",
            leaseId: "lease-1",
          },
        ]}
      />
    );

    expect(
      screen.queryByRole("link", { name: "Add tenant" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add unit" })).toBeInTheDocument();
  });

  it("shows open repairs for the building", () => {
    render(
      <BuildingDetailPage
        buildingId="building-1"
        name="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        units={[
          {
            _id: "1",
            label: "B12",
            tenantName: "Akosua Darko",
            leaseId: "lease-1",
          },
        ]}
        openRepairs={[
          {
            _id: "wo-1",
            title: "Kitchen tap leak",
            status: "received",
            unitLabel: "B12",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Open repairs" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /kitchen tap leak/i })
    ).toHaveAttribute("href", "/repairs/wo-1");
  });
});
