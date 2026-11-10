import { screen } from "@testing-library/react";

import { WritesLockedProvider } from "@/hooks";
import { render } from "@/test-utils";

import StaffAppShell from "./StaffAppShell";

jest.mock("next/navigation", () => ({
  usePathname: () => "/buildings",
}));

describe("StaffAppShell", () => {
  it("renders the sidebar and the page content", () => {
    render(
      <StaffAppShell displayName="Ama Boateng" onSignOut={jest.fn()}>
        <p>Buildings page</p>
      </StaffAppShell>
    );

    expect(screen.getByText("Ama Boateng")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Buildings" })).toHaveAttribute(
      "href",
      "/buildings"
    );
    expect(screen.getByText("Buildings page")).toBeInTheDocument();
    expect(screen.getByText("Buildings page").closest("main")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Toggle navigation" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows the demo lock on the page", () => {
    render(
      <WritesLockedProvider locked>
        <StaffAppShell displayName="Ama Boateng" onSignOut={jest.fn()}>
          <p>Buildings page</p>
        </StaffAppShell>
      </WritesLockedProvider>
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "This demo can't save changes."
    );
  });

  it("keeps the sidebar when the main area is loading", () => {
    render(
      <StaffAppShell displayName="Ama Boateng" onSignOut={jest.fn()}>
        <p>Loading...</p>
      </StaffAppShell>
    );

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
