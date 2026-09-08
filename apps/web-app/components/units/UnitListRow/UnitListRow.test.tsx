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
});
