import { blockDemoSave, demoSignInAccounts, isPublicDemo } from "../demoSignIn";

describe("demoSignIn", () => {
  it("lists staff, owner, and tenant only when each password is set", () => {
    expect(isPublicDemo("on")).toBe(true);
    expect(isPublicDemo(undefined)).toBe(false);
    const report = jest.fn();
    expect(blockDemoSave(false, report)).toBe(false);
    expect(blockDemoSave(true, report)).toBe(true);
    expect(report).toHaveBeenCalledWith("This demo can't save changes.");

    expect(
      demoSignInAccounts({
        staffPassword: "staff-secret",
        ownerPassword: " owner-secret ",
        tenantPassword: "",
      }).map((account) => account.email)
    ).toEqual(["ama.boateng@ridgeway.gh", "naa.lamptey@ridgeway.gh"]);

    expect(
      demoSignInAccounts({
        staffPassword: "staff-secret",
        ownerPassword: "owner-secret",
        tenantPassword: "tenant-secret",
      }).map((account) => account.label)
    ).toEqual([
      "Continue as Ama Boateng, staff",
      "Continue as Naa Densua Lamptey, owner",
      "Continue as Aba Gyamfi, tenant",
    ]);
  });
});
