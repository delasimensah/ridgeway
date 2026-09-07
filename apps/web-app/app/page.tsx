"use client";

import { api } from "@convex/_generated/api";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { LoadingScreen, NotAllowedPage, StaffHomePage } from "@/components";
import { staffGreeting } from "@/utils";

const HomePage = () => {
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
  const home = useQuery(api.staff.getHome, viewer?.isStaff ? {} : "skip");

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/sign-in");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading || !isAuthenticated || !profileReady || viewer === undefined) {
    return <LoadingScreen />;
  }

  if (!viewer.isStaff) {
    return (
      <NotAllowedPage onSignOut={handleSignOut} isSigningOut={isSigningOut} />
    );
  }

  if (home === undefined) {
    return <LoadingScreen />;
  }

  return (
    <StaffHomePage
      greeting={staffGreeting(home.displayName)}
      displayName={home.displayName}
      onSignOut={handleSignOut}
      isSigningOut={isSigningOut}
    />
  );
};

export default HomePage;
