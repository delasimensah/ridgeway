import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffUsersPage from "./StaffUsersPage";

describe("StaffUsersPage", () => {
  it("groups owners, staff, and field workers", () => {
    render(
      <StaffUsersPage
        owners={[
          {
            _id: "owner-1",
            displayName: "Kwesi Mensah",
            contactEmail: "kwesi.mensah@ridgeway.gh",
            contactPhone: "024 555 0000",
            hasLogin: true,
            buildingCount: 2,
          },
        ]}
        staff={[
          {
            _id: "staff-1",
            displayName: "Ama Boateng",
            email: "ama.boateng@ridgeway.gh",
            hasLogin: true,
          },
        ]}
        fieldWorkers={[
          {
            _id: "field-1",
            displayName: "Yaw Darko",
            email: "yaw.darko@ridgeway.gh",
            hasLogin: true,
          },
        ]}
      />
    );

    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Owners" })).toBeInTheDocument();
    expect(screen.getByText("Kwesi Mensah")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Staff" })).toBeInTheDocument();
    expect(screen.getByText("Ama Boateng")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Add office person" })
    ).toHaveAttribute("href", "/office/new");
    expect(
      screen.getByRole("heading", { name: "Field workers" })
    ).toBeInTheDocument();
    expect(screen.getByText("Yaw Darko")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Add field worker" })
    ).toHaveAttribute("href", "/field/new");
  });

  it("shows an empty line for a category with nobody in it", () => {
    render(<StaffUsersPage owners={[]} staff={[]} fieldWorkers={[]} />);

    expect(screen.getByText("No owners yet.")).toBeInTheDocument();
    expect(screen.getByText("No office people yet.")).toBeInTheDocument();
    expect(screen.getByText("No field workers yet.")).toBeInTheDocument();
  });
});
