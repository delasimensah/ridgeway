import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import TenantLeaseEndedNotice from "./TenantLeaseEndedNotice";

describe("TenantLeaseEndedNotice", () => {
  it("names the building and unit that ended", () => {
    render(
      <TenantLeaseEndedNotice unitLabel="B12" buildingName="Ridge Court" />
    );

    expect(
      screen.getByRole("heading", {
        name: "You no longer have access to this unit",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The lease for Ridge Court B12 has ended/i)
    ).toBeInTheDocument();
  });
});
