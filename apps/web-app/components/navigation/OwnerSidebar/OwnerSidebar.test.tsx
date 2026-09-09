import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import OwnerSidebar from "./OwnerSidebar";

describe("OwnerSidebar", () => {
  it("shows the signed-in owner name, home nav, and sign out", async () => {
    const user = userEvent.setup();
    const onSignOut = jest.fn();
    render(<OwnerSidebar displayName="Kwesi Mensah" onSignOut={onSignOut} />);

    expect(screen.getByText("Kwesi Mensah")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(
      screen.queryByRole("link", { name: "Buildings" })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /sign out/i }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
