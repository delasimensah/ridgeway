import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { render } from "@/test-utils";

import StaffSidebar from "./StaffSidebar";

describe("StaffSidebar", () => {
  it("shows the signed-in staff name and sign out", async () => {
    const user = userEvent.setup();
    const onSignOut = jest.fn();
    render(<StaffSidebar displayName="Ama Boateng" onSignOut={onSignOut} />);

    expect(screen.getByText("Ama Boateng")).toBeInTheDocument();
    expect(screen.getByText("Staff")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /sign out/i }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
