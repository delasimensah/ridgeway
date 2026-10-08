import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffFieldWorkerPage from "./StaffFieldWorkerPage";

describe("StaffFieldWorkerPage", () => {
  it("lists this person's jobs and opens edit", () => {
    render(
      <StaffFieldWorkerPage
        profileId={"profile-1" as never}
        displayName="Yaw Darko"
        email="yaw.darko@ridgeway.gh"
        hasLogin
        jobs={[
          {
            _id: "wo-1",
            title: "Kitchen tap leak",
            status: "assigned",
            unitLabel: "B12",
            buildingName: "Ridge Court",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Yaw Darko" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Users" })).toHaveAttribute(
      "href",
      "/users"
    );
    expect(
      screen.getByRole("link", { name: "Edit field worker" })
    ).toHaveAttribute("href", "/field/profile-1/edit");
    expect(
      screen.getByRole("link", { name: "Kitchen tap leak" })
    ).toHaveAttribute("href", "/repairs/wo-1");
    expect(screen.queryByText("Assigned to")).not.toBeInTheDocument();
  });

  it("shows none when this person has no open jobs", () => {
    render(
      <StaffFieldWorkerPage
        profileId={"profile-2" as never}
        displayName="Esi Mensah"
        email={null}
        hasLogin={false}
        jobs={[]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "No jobs assigned." })
    ).toBeInTheDocument();
    expect(screen.getByText(/No email/)).toBeInTheDocument();
    expect(screen.getByText(/Cannot sign in/)).toBeInTheDocument();
  });
});
