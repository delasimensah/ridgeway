"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { LoadingScreen, OwnerHomePage, StaffHomePage } from "@/components";
import { useStaffSession } from "@/hooks";
import { staffGreeting } from "@/utils";

const HomeRoute = () => {
  const session = useStaffSession();
  const home = useQuery(api.staff.getHome, session.isStaff ? {} : "skip");
  const buildings = useQuery(
    api.buildings.listForViewer,
    session.isOwner ? {} : "skip"
  );

  if (session.isSessionLoading) {
    return <LoadingScreen fillViewport={false} />;
  }

  if (session.isStaff) {
    if (home === undefined) {
      return <LoadingScreen fillViewport={false} />;
    }
    return <StaffHomePage greeting={staffGreeting(home.displayName)} />;
  }

  if (session.isOwner) {
    if (buildings === undefined) {
      return <LoadingScreen fillViewport={false} />;
    }
    return (
      <OwnerHomePage
        greeting={staffGreeting(session.displayName)}
        buildings={buildings}
      />
    );
  }

  return <LoadingScreen fillViewport={false} />;
};

export default HomeRoute;
