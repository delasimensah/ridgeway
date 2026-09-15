import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import NotPermittedGate from "./NotPermittedGate";

const mockUseStaffSession = jest.fn();

jest.mock("@/hooks", () => ({
  useStaffSession: () => mockUseStaffSession(),
}));

describe("NotPermittedGate", () => {
  beforeEach(() => {
    mockUseStaffSession.mockReturnValue({
      handleSignOut: jest.fn(),
      isSigningOut: false,
    });
  });

  it("shows the not-allowed screen instead of an empty list", () => {
    const error = Object.assign(new Error("NOT_PERMITTED"), {
      data: { code: "NOT_PERMITTED", message: "NOT_PERMITTED" },
    });

    render(
      <NotPermittedGate error={error}>
        <p>No buildings yet.</p>
      </NotPermittedGate>
    );

    expect(
      screen.getByRole("heading", {
        name: "You don’t have permission to see this page.",
      })
    ).toBeInTheDocument();
    expect(screen.queryByText("No buildings yet.")).not.toBeInTheDocument();
  });
});
