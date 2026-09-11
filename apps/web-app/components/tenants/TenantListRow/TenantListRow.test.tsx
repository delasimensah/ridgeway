import { Table } from "@mantine/core";
import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import TenantListRow from "./TenantListRow";

describe("TenantListRow", () => {
  it("shows the current building and unit and opens edit", () => {
    render(
      <Table>
        <Table.Tbody>
          <TenantListRow
            leaseId="lease-1"
            displayName="Akosua Darko"
            email="akosua@example.com"
            hasLogin
            currentBuildingName="Ridge Court"
            currentUnitLabel="B12"
          />
        </Table.Tbody>
      </Table>
    );

    expect(screen.getByRole("link", { name: "Akosua Darko" })).toHaveAttribute(
      "href",
      "/tenants/lease-1/edit"
    );
    expect(screen.getByText("akosua@example.com")).toBeInTheDocument();
    expect(screen.getByText("Ridge Court · B12")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("shows none when there is no current lease", () => {
    render(
      <Table>
        <Table.Tbody>
          <TenantListRow
            leaseId="lease-2"
            displayName="Sofia Herrera"
            email="sofia.herrera@example.com"
            hasLogin={false}
            currentBuildingName={null}
            currentUnitLabel={null}
          />
        </Table.Tbody>
      </Table>
    );

    expect(screen.getByText("None")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.queryByText("Ridge Court · B12")).not.toBeInTheDocument();
  });
});
