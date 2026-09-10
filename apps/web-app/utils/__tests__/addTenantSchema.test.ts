import { addTenantSchema } from "../addTenantSchema";

describe("addTenantSchema", () => {
  it("accepts a tenant and a lease that already started", () => {
    expect(
      addTenantSchema.parse({
        unitId: "unit-1",
        displayName: "Akosua Darko",
        phone: "024 111 2222",
        email: "akosua@example.com",
        startedOn: "2024-01-15",
        endedOn: "2027-12-31",
        password: "",
      })
    ).toEqual({
      unitId: "unit-1",
      displayName: "Akosua Darko",
      phone: "024 111 2222",
      email: "akosua@example.com",
      startedOn: "2024-01-15",
      endedOn: "2027-12-31",
      password: "",
    });
  });

  it("rejects a blank name", () => {
    const result = addTenantSchema.safeParse({
      unitId: "unit-1",
      displayName: "   ",
      phone: "",
      email: "akosua@example.com",
      startedOn: "2024-01-15",
      endedOn: "",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a lease start in the future", () => {
    const result = addTenantSchema.safeParse({
      unitId: "unit-1",
      displayName: "Akosua Darko",
      phone: "",
      email: "akosua@example.com",
      startedOn: "2099-01-01",
      endedOn: "",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a lease end before the start date", () => {
    const result = addTenantSchema.safeParse({
      unitId: "unit-1",
      displayName: "Akosua Darko",
      phone: "",
      email: "akosua@example.com",
      startedOn: "2024-06-01",
      endedOn: "2024-01-15",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a short password", () => {
    const result = addTenantSchema.safeParse({
      unitId: "unit-1",
      displayName: "Akosua Darko",
      phone: "",
      email: "akosua@example.com",
      startedOn: "2024-01-15",
      endedOn: "",
      password: "short",
    });
    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(
      result.error.issues.some((issue) => issue.path[0] === "password")
    ).toBe(true);
  });

  it("accepts a past tenant without typing name and email again", () => {
    expect(
      addTenantSchema.parse({
        unitId: "unit-1",
        tenantChoice: "profile-1",
        displayName: "",
        phone: "",
        email: "",
        startedOn: "2024-01-15",
        endedOn: "",
        password: "",
      })
    ).toEqual({
      unitId: "unit-1",
      tenantChoice: "profile-1",
      displayName: "",
      phone: "",
      email: "",
      startedOn: "2024-01-15",
      endedOn: "",
      password: "",
    });
  });
});
