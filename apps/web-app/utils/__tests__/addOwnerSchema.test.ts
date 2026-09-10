import { addOwnerSchema } from "../addOwnerSchema";

describe("addOwnerSchema", () => {
  it("accepts a name and contact details without a password", () => {
    expect(
      addOwnerSchema.parse({
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi@example.com",
        contactPhone: "024 555 0000",
        password: "",
      })
    ).toEqual({
      displayName: "Kwesi Mensah",
      contactEmail: "kwesi@example.com",
      contactPhone: "024 555 0000",
      password: "",
    });
  });

  it("rejects a blank name", () => {
    const result = addOwnerSchema.safeParse({
      displayName: "   ",
      contactEmail: "",
      contactPhone: "",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("requires email when a password is set", () => {
    const result = addOwnerSchema.safeParse({
      displayName: "Kwesi Mensah",
      contactEmail: "",
      contactPhone: "",
      password: "RidgewayOwnerA26",
    });
    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(
      result.error.issues.some((issue) => issue.path[0] === "contactEmail")
    ).toBe(true);
  });

  it("rejects a short password", () => {
    const result = addOwnerSchema.safeParse({
      displayName: "Kwesi Mensah",
      contactEmail: "kwesi@example.com",
      contactPhone: "",
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
});
