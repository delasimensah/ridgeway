import { Table } from "@mantine/core";
import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerBuildingListRow from "./OwnerBuildingListRow";

describe("OwnerBuildingListRow", () => {
  it("opens building detail", () => {
    render(
      <Table>
        <Table.Tbody>
          <OwnerBuildingListRow
            buildingId="building-1"
            name="Ridge Court"
            address="14 Ridge Road, Cantonments, Accra"
          />
        </Table.Tbody>
      </Table>
    );

    expect(screen.getByRole("link", { name: "Ridge Court" })).toHaveAttribute(
      "href",
      "/buildings/building-1"
    );
    expect(
      screen.getByText("14 Ridge Road, Cantonments, Accra")
    ).toBeInTheDocument();
  });
});
