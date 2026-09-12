import { Table } from "@mantine/core";
import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerListRow from "./OwnerListRow";

describe("OwnerListRow", () => {
  it("shows building count, login, and opens the owner page", () => {
    render(
      <Table>
        <Table.Tbody>
          <OwnerListRow
            ownerId="owner-1"
            displayName="Kwesi Mensah"
            contactEmail="kwesi.mensah@ridgeway.gh"
            hasLogin
            buildingCount={2}
          />
        </Table.Tbody>
      </Table>
    );

    expect(screen.getByRole("link", { name: "Kwesi Mensah" })).toHaveAttribute(
      "href",
      "/owners/owner-1"
    );
    expect(screen.getByText("kwesi.mensah@ridgeway.gh")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "href",
      "/owners/owner-1"
    );
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("shows a dash for missing email and none when there are no buildings", () => {
    render(
      <Table>
        <Table.Tbody>
          <OwnerListRow
            ownerId="owner-2"
            displayName="Adwoa Owusu"
            contactEmail={null}
            hasLogin={false}
            buildingCount={0}
          />
        </Table.Tbody>
      </Table>
    );

    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });
});
