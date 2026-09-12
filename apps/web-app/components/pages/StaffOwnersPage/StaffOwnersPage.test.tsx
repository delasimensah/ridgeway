import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffOwnersPage from "./StaffOwnersPage";

describe("StaffOwnersPage", () => {
  it("lists owners", () => {
    render(
      <StaffOwnersPage
        owners={[
          {
            _id: "1",
            displayName: "Kwesi Mensah",
            contactEmail: "kwesi.mensah@ridgeway.gh",
            contactPhone: "024 555 0000",
            hasLogin: true,
            buildingCount: 2,
          },
        ]}
      />
    );

    expect(screen.getByRole("heading", { name: "Owners" })).toBeInTheDocument();
    expect(screen.getByText("Kwesi Mensah")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.queryByText("No owners yet.")).not.toBeInTheDocument();
  });

  it("shows an empty line when there are none", () => {
    render(<StaffOwnersPage owners={[]} />);
    expect(screen.getByText("No owners yet.")).toBeInTheDocument();
  });
});
