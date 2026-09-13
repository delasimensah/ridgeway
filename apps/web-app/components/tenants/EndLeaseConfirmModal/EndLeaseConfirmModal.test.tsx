import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import EndLeaseConfirmModal from "./EndLeaseConfirmModal";

describe("EndLeaseConfirmModal", () => {
  it("asks to end the named lease and confirms", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    render(
      <EndLeaseConfirmModal
        opened
        tenantName="Akosua Darko"
        unitLabel="B12"
        buildingName="Ridge Court"
        onConfirm={onConfirm}
        onClose={jest.fn()}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "Are you sure you want to end this lease?",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /end Akosua Darko's lease for Unit B12 at Ridge Court effective immediately/i
      )
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "End lease" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
