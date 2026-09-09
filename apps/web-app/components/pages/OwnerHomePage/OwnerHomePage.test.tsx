import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerHomePage from "./OwnerHomePage";

describe("OwnerHomePage", () => {
  it("lists only the buildings passed in", () => {
    render(
      <OwnerHomePage
        greeting="Good afternoon, Kwesi"
        buildings={[
          {
            _id: "b1",
            name: "Ridge Court",
            address: "14 Ridge Road, Cantonments, Accra",
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
    expect(screen.queryByText("Labone walk-up")).not.toBeInTheDocument();
  });

  it("shows an empty state when this owner has no buildings", () => {
    render(<OwnerHomePage greeting="Good afternoon, Kwesi" buildings={[]} />);

    expect(
      screen.getByRole("heading", { name: "No buildings yet." })
    ).toBeInTheDocument();
  });
});
