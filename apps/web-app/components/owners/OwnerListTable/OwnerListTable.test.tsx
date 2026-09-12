import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerListTable from "./OwnerListTable";

describe("OwnerListTable", () => {
  it("renders a row for each owner", () => {
    render(
      <OwnerListTable
        owners={[
          {
            _id: "1",
            displayName: "Kwesi Mensah",
            contactEmail: "kwesi.mensah@ridgeway.gh",
            contactPhone: "024 555 0000",
            hasLogin: true,
            buildingCount: 2,
          },
          {
            _id: "2",
            displayName: "Adwoa Owusu",
            contactEmail: "adwoa.owusu@ridgeway.gh",
            contactPhone: null,
            hasLogin: false,
            buildingCount: 0,
          },
        ]}
      />
    );

    expect(screen.getByText("Kwesi Mensah")).toBeInTheDocument();
    expect(screen.getByText("Adwoa Owusu")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Can sign in")).toBeInTheDocument();
  });
});
