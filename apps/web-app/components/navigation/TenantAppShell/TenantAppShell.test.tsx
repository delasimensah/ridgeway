import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import TenantAppShell from "./TenantAppShell";

describe("TenantAppShell", () => {
  it("renders the top bar and page content", async () => {
    const user = userEvent.setup();
    const onSignOut = jest.fn();
    render(
      <TenantAppShell displayName="Akosua Darko" onSignOut={onSignOut}>
        <p>Tenant home</p>
      </TenantAppShell>
    );

    expect(screen.getByText("Akosua Darko")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ridgeway" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByText("Tenant home")).toBeInTheDocument();
    expect(screen.getByText("Tenant home").closest("main")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /sign out/i }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
