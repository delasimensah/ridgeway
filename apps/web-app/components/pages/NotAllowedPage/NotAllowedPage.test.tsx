import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import NotAllowedPage from "./NotAllowedPage";

describe("NotAllowedPage", () => {
  it("explains the person cannot see this page and lets them sign out", async () => {
    const user = userEvent.setup();
    const onSignOut = jest.fn();
    render(<NotAllowedPage onSignOut={onSignOut} />);

    expect(
      screen.getByRole("heading", { name: "Ridgeway" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "You don’t have permission to see this page.",
      })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /sign out/i }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
