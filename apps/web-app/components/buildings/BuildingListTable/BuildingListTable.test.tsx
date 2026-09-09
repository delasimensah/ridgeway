import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import BuildingListTable from "./BuildingListTable";

describe("BuildingListTable", () => {
  it("renders a row for each building", () => {
    render(
      <BuildingListTable
        buildings={[
          {
            _id: "1",
            name: "Ridge Court",
            address: "14 Ridge Road, Cantonments, Accra",
            ownerName: "Kwesi Mensah",
            unitCount: 0,
          },
          {
            _id: "2",
            name: "Labone walk-up",
            address: "32 Labone Crescent, Labone, Accra",
            ownerName: null,
            unitCount: 0,
          },
        ]}
      />
    );

    expect(screen.getByText("Ridge Court")).toBeInTheDocument();
    expect(screen.getByText("Kwesi Mensah")).toBeInTheDocument();
    expect(screen.getByText("Labone walk-up")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Open repairs")).toBeInTheDocument();
  });
});
