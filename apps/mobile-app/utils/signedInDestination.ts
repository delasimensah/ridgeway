export const SIGNED_IN_FIELD_JOBS = "/(main-app)/(tabs)/jobs";
export const SIGNED_IN_TENANT_HOME = "/(tenant-app)/(tabs)/home";
export const SIGNED_IN_LEASE_ENDED = "/lease-ended";
export const SIGNED_IN_NOT_ALLOWED = "/not-allowed";

export type SignedInRoute =
  | typeof SIGNED_IN_FIELD_JOBS
  | typeof SIGNED_IN_TENANT_HOME
  | typeof SIGNED_IN_LEASE_ENDED
  | typeof SIGNED_IN_NOT_ALLOWED;

export type SignedInRoutingSession = {
  isAuthenticated: boolean;
  isViewerReady: boolean;
  isField: boolean;
  isTenant: boolean;
  currentLease: { unitId: string } | null;
};

export function shouldWaitForRole(session: {
  isAuthenticated: boolean;
  isViewerReady: boolean;
}): boolean {
  return session.isAuthenticated && !session.isViewerReady;
}

export function signedInDestination(
  session: SignedInRoutingSession
): SignedInRoute | null {
  if (!session.isViewerReady) {
    return null;
  }
  if (session.isField) {
    return SIGNED_IN_FIELD_JOBS;
  }
  if (session.currentLease !== null) {
    return SIGNED_IN_TENANT_HOME;
  }
  if (session.isTenant) {
    return SIGNED_IN_LEASE_ENDED;
  }
  return SIGNED_IN_NOT_ALLOWED;
}

export function signedInStackGuards(session: SignedInRoutingSession) {
  const ready = session.isAuthenticated && session.isViewerReady;
  return {
    canEnterField: ready && session.isField,
    canEnterTenant: ready && session.currentLease !== null,
    canEnterEnded: ready && session.isTenant && session.currentLease === null,
    canEnterNotAllowed: ready && !session.isField && !session.isTenant,
  };
}
