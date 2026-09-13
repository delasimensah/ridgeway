import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import TenantLeaseEndedPage from "./TenantLeaseEndedPage";

describe("TenantLeaseEndedPage", () => {
  it("lets the person sign out after the lease ended", async () => {
    const user = userEvent.setup();
    const onSignOut = jest.fn();
    render(
      <TenantLeaseEndedPage
        unitLabel="B12"
        buildingName="Ridge Court"
        onSignOut={onSignOut}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Ridgeway" })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /sign out/i }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
