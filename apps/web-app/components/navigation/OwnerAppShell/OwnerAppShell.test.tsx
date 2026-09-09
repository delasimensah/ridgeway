import { screen } from "@testing-library/react";

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
  });
});
