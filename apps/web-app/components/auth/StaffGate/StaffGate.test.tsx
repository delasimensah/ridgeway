import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffGate from "./StaffGate";

const mockUseStaffSession = jest.fn();

jest.mock("@/hooks", () => ({
  useStaffSession: () => mockUseStaffSession(),
}));

describe("StaffGate", () => {
  beforeEach(() => {
    mockUseStaffSession.mockReset();
  });

  it("shows loading while the session is resolving", () => {
    mockUseStaffSession.mockReturnValue({
      isSessionLoading: true,
      isStaff: false,
      displayName: "",
      isSigningOut: false,
      handleSignOut: jest.fn(),
    });

    render(<StaffGate>{() => <p>Office</p>}</StaffGate>);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Office")).not.toBeInTheDocument();
  });

  it("shows the not-allowed screen when the person is not staff", () => {
    mockUseStaffSession.mockReturnValue({
      isSessionLoading: false,
      isStaff: false,
      displayName: "Yaw Darko",
      isSigningOut: false,
      handleSignOut: jest.fn(),
    });

    render(<StaffGate>{() => <p>Office</p>}</StaffGate>);

    expect(
      screen.getByRole("heading", { name: "You cannot open the office" })
    ).toBeInTheDocument();
  });

  it("renders staff children when the session is ready", () => {
    mockUseStaffSession.mockReturnValue({
      isSessionLoading: false,
      isStaff: true,
      displayName: "Ama Boateng",
      isSigningOut: false,
      handleSignOut: jest.fn(),
    });

    render(<StaffGate>{({ displayName }) => <p>{displayName}</p>}</StaffGate>);

    expect(screen.getByText("Ama Boateng")).toBeInTheDocument();
  });
});
