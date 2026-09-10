import { renderHook, waitFor } from "@testing-library/react";

import { StaffSessionProvider, useStaffSession } from "../useStaffSession";

const mockReplace = jest.fn();
const mockSignOut = jest.fn();
const mockEnsureProfile = jest.fn();
let mockAuth = { isAuthenticated: false, isLoading: true };
let mockViewer:
  | {
      isStaff: boolean;
      displayName: string;
      ownerId: string | null;
      currentLease: {
        leaseId: string;
        unitId: string;
        buildingId: string;
        unitLabel: string;
        buildingName: string;
        address: string;
      } | null;
    }
  | undefined;

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

function renderSession() {
  return renderHook(() => useStaffSession(), {
    wrapper: StaffSessionProvider,
  });
}

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
    renderSession();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/sign-in");
    });
  });

  it("reports staff once the profile is ready", async () => {
    mockAuth = { isAuthenticated: true, isLoading: false };
    mockViewer = {
      isStaff: true,
      displayName: "Ama Boateng",
      ownerId: null,
      currentLease: null,
    };
    const { result } = renderSession();

    await waitFor(() => {
      expect(result.current.isStaff).toBe(true);
    });
    expect(result.current.isOwner).toBe(false);
    expect(result.current.displayName).toBe("Ama Boateng");
  });

  it("reports an owner once the profile is ready", async () => {
    mockAuth = { isAuthenticated: true, isLoading: false };
    mockViewer = {
      isStaff: false,
      displayName: "Kwesi Mensah",
      ownerId: "owner-1",
      currentLease: null,
    };
    const { result } = renderSession();

    await waitFor(() => {
      expect(result.current.isOwner).toBe(true);
    });
    expect(result.current.isStaff).toBe(false);
    expect(result.current.displayName).toBe("Kwesi Mensah");
  });

  it("reports a tenant once the profile is ready", async () => {
    mockAuth = { isAuthenticated: true, isLoading: false };
    mockViewer = {
      isStaff: false,
      displayName: "Akosua Darko",
      ownerId: null,
      currentLease: {
        leaseId: "lease-1",
        unitId: "unit-1",
        buildingId: "building-1",
        unitLabel: "B12",
        buildingName: "Ridge Court",
        address: "14 Ridge Road, Cantonments, Accra",
      },
    };
    const { result } = renderSession();

    await waitFor(() => {
      expect(result.current.isTenant).toBe(true);
    });
    expect(result.current.isStaff).toBe(false);
    expect(result.current.currentLease?.unitLabel).toBe("B12");
  });
});
