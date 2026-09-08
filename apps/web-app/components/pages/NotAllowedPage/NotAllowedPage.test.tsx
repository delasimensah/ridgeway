import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import NotAllowedPage from "./NotAllowedPage";

describe("NotAllowedPage", () => {
  it("tells a non-staff person they cannot see the staff home", async () => {
    const user = userEvent.setup();
    const onSignOut = jest.fn();
    render(<NotAllowedPage onSignOut={onSignOut} />);

    expect(
      screen.getByRole("heading", { name: "You cannot open the office" })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /sign out/i }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
