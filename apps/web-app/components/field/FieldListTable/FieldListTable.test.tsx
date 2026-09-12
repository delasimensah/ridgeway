import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import FieldListTable from "./FieldListTable";

describe("FieldListTable", () => {
  it("renders a row for each field worker", () => {
    render(
      <FieldListTable
        people={[
          {
            _id: "1",
            displayName: "Yaw Darko",
            email: "yaw.darko@ridgeway.gh",
            hasLogin: true,
          },
        ]}
      />
    );

    expect(screen.getByText("Yaw Darko")).toBeInTheDocument();
    expect(screen.getByText("yaw.darko@ridgeway.gh")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Can sign in")).toBeInTheDocument();
  });
});
