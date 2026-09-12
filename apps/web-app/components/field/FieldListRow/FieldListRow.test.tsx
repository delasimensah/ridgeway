import { Table } from "@mantine/core";
import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import FieldListRow from "./FieldListRow";

describe("FieldListRow", () => {
  it("shows login and opens the edit form", () => {
    render(
      <Table>
        <Table.Tbody>
          <FieldListRow
            profileId="profile-1"
            displayName="Yaw Darko"
            email="yaw.darko@ridgeway.gh"
            hasLogin
          />
        </Table.Tbody>
      </Table>
    );

    expect(screen.getByRole("link", { name: "Yaw Darko" })).toHaveAttribute(
      "href",
      "/field/profile-1/edit"
    );
    expect(screen.getByText("yaw.darko@ridgeway.gh")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });
});
