import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import StaffSidebar from "./StaffSidebar";

describe("StaffSidebar", () => {
  it("shows the signed-in staff name, nav, and sign out", async () => {
    const user = userEvent.setup();
    const onSignOut = jest.fn();
    render(<StaffSidebar displayName="Ama Boateng" onSignOut={onSignOut} />);

    expect(screen.getByText("Ama Boateng")).toBeInTheDocument();
    expect(screen.getByText("AB")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "Buildings" })).toHaveAttribute(
      "href",
      "/buildings"
    );
    expect(screen.getByRole("link", { name: "Owners" })).toHaveAttribute(
      "href",
      "/owners"
    );
    expect(screen.getByRole("link", { name: "Tenants" })).toHaveAttribute(
      "href",
      "/tenants"
    );
    expect(screen.getByRole("link", { name: "Staff" })).toHaveAttribute(
      "href",
      "/office"
    );
    expect(screen.getByRole("link", { name: "Field workers" })).toHaveAttribute(
      "href",
      "/field"
    );
    expect(screen.getByRole("link", { name: "Repairs" })).toHaveAttribute(
      "href",
      "/repairs"
    );
    expect(screen.getByRole("link", { name: "Rent" })).toHaveAttribute(
      "href",
      "/rent"
    );

    await user.click(screen.getByRole("button", { name: /sign out/i }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it("calls onNavigate when a nav link is pressed", async () => {
    const user = userEvent.setup();
    const onNavigate = jest.fn();
    render(
      <StaffSidebar
        displayName="Ama Boateng"
        onSignOut={jest.fn()}
        onNavigate={onNavigate}
      />
    );

    const link = screen.getByRole("link", { name: "Buildings" });
    link.addEventListener("click", (event) => event.preventDefault());
    await user.click(link);
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
