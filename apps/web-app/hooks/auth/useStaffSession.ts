"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type StaffSessionLease = {
  leaseId: Id<"leases">;
  unitId: Id<"units">;
  buildingId: Id<"buildings">;
  unitLabel: string;
  buildingName: string;
  address: string;
};

export type StaffSession = {
  isSessionLoading: boolean;
  isStaff: boolean;
  isOwner: boolean;
  isTenant: boolean;
  currentLease: StaffSessionLease | null;
  displayName: string;
  isSigningOut: boolean;
  handleSignOut: () => Promise<void>;
};

const StaffSessionContext = createContext<StaffSession | null>(null);

function useStaffSessionState(): StaffSession {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const ensureProfile = useMutation(api.profiles.ensureForCurrentUser);
  const [profileReady, setProfileReady] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      router.replace("/sign-in");
      return;
    }
    let cancelled = false;
    void ensureProfile({})
      .then(() => {
        if (!cancelled) {
          setProfileReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProfileReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [ensureProfile, isAuthenticated, isLoading, router]);

  const viewer = useQuery(
    api.profiles.getCurrent,
    isAuthenticated && profileReady ? {} : "skip"
  );

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/sign-in");
    } finally {
      setIsSigningOut(false);
    }
  };

  const isSessionLoading =
    isLoading || !isAuthenticated || !profileReady || viewer === undefined;

  return {
    isSessionLoading,
    isStaff: viewer?.isStaff === true,
    isOwner: viewer?.ownerId !== null && viewer?.ownerId !== undefined,
    isTenant:
      viewer?.currentLease !== null && viewer?.currentLease !== undefined,
    currentLease: viewer?.currentLease ?? null,
    displayName: viewer?.displayName ?? "",
    isSigningOut,
    handleSignOut,
  };
}

export function StaffSessionProvider({ children }: { children: ReactNode }) {
  const session = useStaffSessionState();
  return createElement(
    StaffSessionContext.Provider,
    { value: session },
    children
  );
}

export function useStaffSession(): StaffSession {
  const session = useContext(StaffSessionContext);
  if (session === null) {
    throw new Error("useStaffSession must be used under StaffSessionProvider");
  }
  return session;
}
