import { render, screen } from "@testing-library/react-native";

import NotPermittedGate from "./NotPermittedGate";

const mockUseFieldSession = jest.fn();

jest.mock("@/hooks", () => {
  const actual = jest.requireActual("@/hooks");
  return {
    ...actual,
    useFieldSession: () => mockUseFieldSession(),
  };
});

describe("NotPermittedGate", () => {
  beforeEach(() => {
    mockUseFieldSession.mockReturnValue({
      handleSignOut: jest.fn(),
      isSigningOut: false,
    });
  });

  it("shows the not-allowed screen instead of an empty list", () => {
    const error = Object.assign(new Error("NOT_PERMITTED"), {
      data: { code: "NOT_PERMITTED", message: "NOT_PERMITTED" },
    });

    render(
      <NotPermittedGate error={error}>No jobs assigned today.</NotPermittedGate>
    );

    expect(
      screen.getByText("You don’t have permission to see this page.")
    ).toBeTruthy();
    expect(screen.queryByText("No jobs assigned today.")).toBeNull();
  });
});
