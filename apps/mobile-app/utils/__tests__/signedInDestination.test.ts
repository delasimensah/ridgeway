import {
  SIGNED_IN_FIELD_JOBS,
  SIGNED_IN_TENANT_HOME,
  shouldWaitForRole,
  signedInDestination,
  signedInStackGuards,
} from "../signedInDestination";

const tenantLoading = {
  isAuthenticated: true,
  isViewerReady: false,
  isField: false,
  isTenant: false,
  currentLease: null,
};

describe("signedInDestination", () => {
  it("does not send a signed-in person to field Jobs while the viewer is not ready", () => {
    expect(signedInDestination(tenantLoading)).toBeNull();
    expect(signedInStackGuards(tenantLoading).canEnterField).toBe(false);
    expect(shouldWaitForRole(tenantLoading)).toBe(true);

    expect(
      signedInDestination({
        ...tenantLoading,
        isViewerReady: true,
        isTenant: true,
        currentLease: { unitId: "unit-1" },
      })
    ).toBe(SIGNED_IN_TENANT_HOME);

    expect(
      signedInDestination({
        ...tenantLoading,
        isViewerReady: true,
        isField: true,
      })
    ).toBe(SIGNED_IN_FIELD_JOBS);
    expect(
      signedInStackGuards({
        ...tenantLoading,
        isViewerReady: true,
        isField: true,
      }).canEnterField
    ).toBe(true);
  });
});
