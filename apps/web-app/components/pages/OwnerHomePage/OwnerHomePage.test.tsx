import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerHomePage from "./OwnerHomePage";

describe("OwnerHomePage", () => {
  it("lists occupancy, open issues, and rent for this owner's buildings only", () => {
    render(
      <OwnerHomePage
        greeting="Good afternoon, Kwesi"
        collected={450000}
        outstanding={0}
        currency="GHS"
        buildings={[
          {
            _id: "b1",
            name: "Ridge Court",
            address: "14 Ridge Road, Cantonments, Accra",
            occupiedCount: 1,
            unitCount: 2,
            openRepairCount: 1,
            collected: 450000,
            outstanding: 0,
            currency: "GHS",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Good afternoon, Kwesi" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Your buildings with Ridgeway")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ridge Court" })
    ).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.queryByText("Labone walk-up")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Portfolio status" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View Rent Details" })
    ).toHaveAttribute("href", "/rent");
  });

  it("shows an empty state when this owner has no buildings", () => {
    render(
      <OwnerHomePage
        greeting="Good afternoon, Kwesi"
        buildings={[]}
        collected={0}
        outstanding={0}
        currency="GHS"
      />
    );

    expect(
      screen.getByRole("heading", { name: "No buildings yet." })
    ).toBeInTheDocument();
  });
});
