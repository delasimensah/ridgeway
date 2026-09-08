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
      })
    ).toEqual({
      unitId: "unit-1",
      displayName: "Akosua Darko",
      phone: "024 111 2222",
      email: "akosua@example.com",
      startedOn: "2024-01-15",
      endedOn: "2027-12-31",
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
    });
    expect(result.success).toBe(false);
  });
});
