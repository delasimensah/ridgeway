import { NEW_TENANT_CHOICE } from "../addTenantSchema";
import { addUnitSchema } from "../addUnitSchema";

describe("addUnitSchema", () => {
  it("accepts a unit label and kind", () => {
    expect(
      addUnitSchema.parse({
        label: "A3",
        kind: "apartment",
      })
    ).toEqual({
      label: "A3",
      kind: "apartment",
    });
  });

  it("rejects a blank label", () => {
    const result = addUnitSchema.safeParse({
      label: "   ",
      kind: "apartment",
    });
    expect(result.success).toBe(false);
  });

  it("requires a name, email, and lease start when adding a tenant", () => {
    const result = addUnitSchema.safeParse({
      label: "B12",
      kind: "apartment",
      tenantChoice: NEW_TENANT_CHOICE,
      displayName: "   ",
      email: "",
      startedOn: "",
    });
    expect(result.success).toBe(false);
  });

  it("requires a lease start when picking a past tenant", () => {
    const result = addUnitSchema.safeParse({
      label: "4B",
      kind: "apartment",
      tenantChoice: "profile-1",
      startedOn: "",
    });
    expect(result.success).toBe(false);
  });
});
