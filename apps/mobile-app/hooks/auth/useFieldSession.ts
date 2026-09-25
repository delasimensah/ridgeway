import { api } from "@convex/_generated/api";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type FieldSession = {
  isSessionLoading: boolean;
  isAuthenticated: boolean;
  isViewerReady: boolean;
  isField: boolean;
  isTenant: boolean;
  currentLease: {
    unitId: string;
    unitLabel: string;
    buildingName: string;
    address: string;
  } | null;
  endedLease: {
    unitLabel: string;
    buildingName: string;
  } | null;
  displayName: string;
  isSigningOut: boolean;
  handleSignOut: () => Promise<void>;
};

const FieldSessionContext = createContext<FieldSession | null>(null);

function useFieldSessionState(): FieldSession {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const ensureProfile = useMutation(api.profiles.ensureForCurrentUser);
  const [profileEnsured, setProfileEnsured] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const canLoadProfile = isAuthenticated && !isLoading;

  useEffect(() => {
    if (!canLoadProfile) {
      return;
    }
    let cancelled = false;
    void ensureProfile({})
      .then(() => {
        if (!cancelled) {
          setProfileEnsured(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProfileEnsured(true);
        }
      });
    return () => {
      cancelled = true;
      setProfileEnsured(false);
    };
  }, [canLoadProfile, ensureProfile]);

  const profileReady = canLoadProfile && profileEnsured;
  const viewer = useQuery(
    api.profiles.getCurrent,
    isAuthenticated && profileReady ? {} : "skip"
  );

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return {
    isSessionLoading: isLoading,
    isAuthenticated,
    isViewerReady: isAuthenticated && profileReady && viewer !== undefined,
    isField: viewer?.isField === true,
    isTenant:
      (viewer?.currentLease !== null && viewer?.currentLease !== undefined) ||
      (viewer?.endedLease !== null && viewer?.endedLease !== undefined),
    currentLease: viewer?.currentLease
      ? {
          unitId: viewer.currentLease.unitId,
          unitLabel: viewer.currentLease.unitLabel,
          buildingName: viewer.currentLease.buildingName,
          address: viewer.currentLease.address,
        }
      : null,
    endedLease: viewer?.endedLease ?? null,
    displayName: viewer?.displayName ?? "",
    isSigningOut,
    handleSignOut,
  };
}

export function FieldSessionProvider({ children }: { children: ReactNode }) {
  const session = useFieldSessionState();
  return createElement(
    FieldSessionContext.Provider,
    { value: session },
    children
  );
}

export function useFieldSession(): FieldSession {
  const session = useContext(FieldSessionContext);
  if (session === null) {
    throw new Error("useFieldSession must be used under FieldSessionProvider");
  }
  return session;
}
