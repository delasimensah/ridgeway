import { Table } from "@mantine/core";
import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import UnitListRow from "./UnitListRow";

describe("UnitListRow", () => {
  it("shows the unit label and links to correct it", () => {
    render(
      <Table>
        <Table.Tbody>
          <UnitListRow buildingId="building-1" unitId="unit-1" label="A3" />
        </Table.Tbody>
      </Table>
    );

    expect(screen.getByRole("link", { name: "A3" })).toHaveAttribute(
      "href",
      "/buildings/building-1/units/unit-1/edit"
    );
    expect(screen.getAllByText("—")).toHaveLength(3);
  });

  it("shows the tenant and lease end date when a lease exists", () => {
    render(
      <Table>
        <Table.Tbody>
          <UnitListRow
            buildingId="building-1"
            unitId="unit-1"
            label="B12"
            tenantName="Akosua Darko"
            leaseId="lease-1"
            leaseEndedOn="2027-12-31"
            rentAmount={450000}
            rentCurrency="GHS"
          />
        </Table.Tbody>
      </Table>
    );

    expect(screen.getByRole("link", { name: "Akosua Darko" })).toHaveAttribute(
      "href",
      "/buildings/building-1/tenants/lease-1/edit"
    );
    expect(screen.getByText("31 Dec 2027")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 4,500")).toBeInTheDocument();
  });
});
