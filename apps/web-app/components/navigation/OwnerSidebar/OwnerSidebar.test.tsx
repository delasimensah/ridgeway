import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import OwnerSidebar from "./OwnerSidebar";

describe("OwnerSidebar", () => {
  it("shows Home, Buildings, Issues, and Rent", async () => {
    const user = userEvent.setup();
    const onSignOut = jest.fn();
    render(<OwnerSidebar displayName="Kwesi Mensah" onSignOut={onSignOut} />);

    expect(screen.getByText("Kwesi Mensah")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "Buildings" })).toHaveAttribute(
      "href",
      "/buildings"
    );
    expect(screen.getByRole("link", { name: "Issues" })).toHaveAttribute(
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
});
