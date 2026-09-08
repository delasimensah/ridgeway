import { renderHook, waitFor } from "@testing-library/react";

import { useStaffSession } from "../useStaffSession";

const mockReplace = jest.fn();
const mockSignOut = jest.fn();
const mockEnsureProfile = jest.fn();
let mockAuth = { isAuthenticated: false, isLoading: true };
let mockViewer: { isStaff: boolean; displayName: string } | undefined;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
  }),
}));

jest.mock("@convex-dev/auth/react", () => ({
  useConvexAuth: () => mockAuth,
  useAuthActions: () => ({
    signOut: mockSignOut,
  }),
}));

jest.mock("convex/react", () => ({
  useMutation: () => mockEnsureProfile,
  useQuery: () => mockViewer,
}));

describe("useStaffSession", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockSignOut.mockReset();
    mockEnsureProfile.mockReset();
    mockEnsureProfile.mockResolvedValue("profile-id");
    mockAuth = { isAuthenticated: false, isLoading: true };
    mockViewer = undefined;
  });

  it("sends a signed-out person to sign in", async () => {
    mockAuth = { isAuthenticated: false, isLoading: false };
    renderHook(() => useStaffSession());

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/sign-in");
    });
  });

  it("reports staff once the profile is ready", async () => {
    mockAuth = { isAuthenticated: true, isLoading: false };
    mockViewer = { isStaff: true, displayName: "Ama Boateng" };
    const { result } = renderHook(() => useStaffSession());

    await waitFor(() => {
      expect(result.current.isStaff).toBe(true);
    });
    expect(result.current.displayName).toBe("Ama Boateng");
  });
});
