import { screen } from "@testing-library/react";
import React from "react";

import { render } from "@/test-utils";

import StaffHomePage from "./StaffHomePage";

describe("StaffHomePage", () => {
  it("shows the greeting and an almost empty home", () => {
    render(
      <StaffHomePage
        greeting="Good afternoon, Ama"
        displayName="Ama Boateng"
        onSignOut={jest.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Good afternoon, Ama" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Buildings and repairs will show here.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign out/i })
    ).toBeInTheDocument();
  });
});
