import { useAuthActions } from "@convex-dev/auth/react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useMutation, useQuery } from "convex/react";

import { FieldSessionProvider, useFieldSession } from "../useFieldSession";

const mockSignOut = jest.fn();
const mockEnsure = jest.fn();

jest.mock("@convex-dev/auth/react", () => ({
  useAuthActions: jest.fn(),
  useConvexAuth: jest.fn(),
}));

jest.mock("convex/react", () => ({
  useMutation: jest.fn(),
  useQuery: jest.fn(),
}));

describe("useFieldSession", () => {
  beforeEach(() => {
    mockSignOut.mockReset();
    mockEnsure.mockReset();
    mockEnsure.mockResolvedValue("profile-1");
    (useAuthActions as jest.Mock).mockReturnValue({ signOut: mockSignOut });
    (useMutation as jest.Mock).mockReturnValue(mockEnsure);
    (useQuery as jest.Mock).mockReturnValue({
      isField: true,
      displayName: "Yaw Darko",
      currentLease: null,
      endedLease: null,
    });
  });

  it("exposes a field worker after the profile is ready", async () => {
    const { useConvexAuth } = require("@convex-dev/auth/react") as {
      useConvexAuth: jest.Mock;
    };
    useConvexAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useFieldSession(), {
      wrapper: FieldSessionProvider,
    });

    await waitFor(() => {
      expect(result.current.isField).toBe(true);
      expect(result.current.displayName).toBe("Yaw Darko");
      expect(result.current.isViewerReady).toBe(true);
      expect(result.current.isSessionLoading).toBe(false);
    });
  });

  it("does not treat profile load as session loading", async () => {
    const { useConvexAuth } = require("@convex-dev/auth/react") as {
      useConvexAuth: jest.Mock;
    };
    useConvexAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });
    (useQuery as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useFieldSession(), {
      wrapper: FieldSessionProvider,
    });

    await waitFor(() => {
      expect(result.current.isSessionLoading).toBe(false);
      expect(result.current.isViewerReady).toBe(false);
      expect(result.current.isField).toBe(false);
    });
  });

  it("treats Convex auth restore as session loading", () => {
    const { useConvexAuth } = require("@convex-dev/auth/react") as {
      useConvexAuth: jest.Mock;
    };
    useConvexAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { result } = renderHook(() => useFieldSession(), {
      wrapper: FieldSessionProvider,
    });

    expect(result.current.isSessionLoading).toBe(true);
  });
});
