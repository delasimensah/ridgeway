import { Table } from "@mantine/core";
import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OfficeListRow from "./OfficeListRow";

describe("OfficeListRow", () => {
  it("shows login and opens the edit form", () => {
    render(
      <Table>
        <Table.Tbody>
          <OfficeListRow
            profileId="profile-1"
            displayName="Ama Boateng"
            email="ama.boateng@ridgeway.gh"
            hasLogin
          />
        </Table.Tbody>
      </Table>
    );

    expect(screen.getByRole("link", { name: "Ama Boateng" })).toHaveAttribute(
      "href",
      "/office/profile-1/edit"
    );
    expect(screen.getByText("ama.boateng@ridgeway.gh")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });
});
