import { Table } from "@mantine/core";
import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import BuildingListRow from "./BuildingListRow";

describe("BuildingListRow", () => {
  it("shows the building name, address, and counts", () => {
    render(
      <Table>
        <Table.Tbody>
          <BuildingListRow
            buildingId="building-1"
            name="Ridge Court"
            address="14 Ridge Road, Cantonments, Accra"
            ownerLabel="—"
            unitCount={0}
            openRepairCount={0}
          />
        </Table.Tbody>
      </Table>
    );

    expect(screen.getByText("Ridge Court")).toBeInTheDocument();
    expect(
      screen.getByText("14 Ridge Road, Cantonments, Accra")
    ).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Ridge Court" })).toHaveAttribute(
      "href",
      "/buildings/building-1/edit"
    );
  });
});
