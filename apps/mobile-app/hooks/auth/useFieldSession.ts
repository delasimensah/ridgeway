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
  displayName: string;
  isSigningOut: boolean;
  handleSignOut: () => Promise<void>;
};

const FieldSessionContext = createContext<FieldSession | null>(null);

function useFieldSessionState(): FieldSession {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const ensureProfile = useMutation(api.profiles.ensureForCurrentUser);
  const [profileReady, setProfileReady] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      setProfileReady(false);
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
  }, [ensureProfile, isAuthenticated, isLoading]);

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
