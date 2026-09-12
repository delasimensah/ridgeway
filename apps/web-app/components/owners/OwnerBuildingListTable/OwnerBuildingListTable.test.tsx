import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerBuildingListTable from "./OwnerBuildingListTable";

describe("OwnerBuildingListTable", () => {
  it("renders a row for each building", () => {
    render(
      <OwnerBuildingListTable
        buildings={[
          {
            _id: "building-1",
            name: "Ridge Court",
            address: "14 Ridge Road, Cantonments, Accra",
          },
          {
            _id: "building-2",
            name: "Labone walk-up",
            address: "8 Labone Crescent, Labone, Accra",
          },
        ]}
      />
    );

    expect(screen.getByText("Ridge Court")).toBeInTheDocument();
    expect(screen.getByText("Labone walk-up")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });
});
