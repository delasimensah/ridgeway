import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffOwnerPage from "./StaffOwnerPage";

describe("StaffOwnerPage", () => {
  it("lists this owner's buildings and opens edit", () => {
    render(
      <StaffOwnerPage
        ownerId={"owner-1" as never}
        displayName="Kwesi Mensah"
        contactEmail="kwesi.mensah@ridgeway.gh"
        hasLogin
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

    expect(
      screen.getByRole("heading", { name: "Kwesi Mensah" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Owners" })).toHaveAttribute(
      "href",
      "/owners"
    );
    expect(screen.getByRole("link", { name: "Edit owner" })).toHaveAttribute(
      "href",
      "/owners/owner-1/edit"
    );
    expect(screen.getByRole("link", { name: "Ridge Court" })).toHaveAttribute(
      "href",
      "/buildings/building-1"
    );
    expect(
      screen.getByRole("link", { name: "Labone walk-up" })
    ).toHaveAttribute("href", "/buildings/building-2");
  });

  it("shows none when this owner has no buildings", () => {
    render(
      <StaffOwnerPage
        ownerId={"owner-2" as never}
        displayName="Adwoa Owusu"
        contactEmail={null}
        hasLogin={false}
        buildings={[]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "No buildings yet." })
    ).toBeInTheDocument();
    expect(screen.getByText(/No email/)).toBeInTheDocument();
    expect(screen.getByText(/Cannot sign in/)).toBeInTheDocument();
  });
});
