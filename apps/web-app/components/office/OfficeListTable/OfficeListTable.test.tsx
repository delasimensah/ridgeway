import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OfficeListTable from "./OfficeListTable";

describe("OfficeListTable", () => {
  it("renders a row for each office person", () => {
    render(
      <OfficeListTable
        people={[
          {
            _id: "1",
            displayName: "Ama Boateng",
            email: "ama.boateng@ridgeway.gh",
            hasLogin: true,
          },
        ]}
      />
    );

    expect(screen.getByText("Ama Boateng")).toBeInTheDocument();
    expect(screen.getByText("ama.boateng@ridgeway.gh")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Can sign in")).toBeInTheDocument();
  });
});
