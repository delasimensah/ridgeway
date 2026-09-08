import { addOwnerSchema } from "../addOwnerSchema";

describe("addOwnerSchema", () => {
  it("accepts a name and contact details", () => {
    expect(
      addOwnerSchema.parse({
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi@example.com",
        contactPhone: "024 555 0000",
      })
    ).toEqual({
      displayName: "Kwesi Mensah",
      contactEmail: "kwesi@example.com",
      contactPhone: "024 555 0000",
    });
  });

  it("rejects a blank name", () => {
    const result = addOwnerSchema.safeParse({
      displayName: "   ",
      contactEmail: "",
      contactPhone: "",
    });
    expect(result.success).toBe(false);
  });
});
