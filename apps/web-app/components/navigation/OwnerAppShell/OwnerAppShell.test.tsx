import { screen } from "@testing-library/react";

import { WritesLockedProvider } from "@/hooks";
import { render } from "@/test-utils";

import OwnerAppShell from "./OwnerAppShell";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("OwnerAppShell", () => {
  it("renders the sidebar and the page content", () => {
    render(
      <OwnerAppShell displayName="Kwesi Mensah" onSignOut={jest.fn()}>
        <p>Owner home</p>
      </OwnerAppShell>
    );

    expect(screen.getByText("Kwesi Mensah")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByText("Owner home")).toBeInTheDocument();
    expect(screen.getByText("Owner home").closest("main")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Toggle navigation" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows the demo lock on the page", () => {
    render(
      <WritesLockedProvider locked>
        <OwnerAppShell displayName="Kwesi Mensah" onSignOut={jest.fn()}>
          <p>Owner home</p>
        </OwnerAppShell>
      </WritesLockedProvider>
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "This demo can't save changes."
    );
  });
});
