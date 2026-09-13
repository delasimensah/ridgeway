import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffFieldPage from "./StaffFieldPage";

describe("StaffFieldPage", () => {
  it("lists field workers", () => {
    render(
      <StaffFieldPage
        people={[
          {
            _id: "1",
            displayName: "Yaw Darko",
            email: "yaw.darko@ridgeway.gh",
            hasLogin: true,
          },
        ]}
      />
    );

    expect(screen.getByRole("heading", { name: "Field" })).toBeInTheDocument();
    expect(screen.getByText("Yaw Darko")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Add field worker" })
    ).toHaveAttribute("href", "/field/new");
  });
});
