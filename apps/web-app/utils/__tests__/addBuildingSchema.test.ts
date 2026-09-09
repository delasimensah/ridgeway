import { addBuildingSchema } from "../addBuildingSchema";
import { NEW_OWNER_CHOICE } from "../addOwnerSchema";

describe("addBuildingSchema", () => {
  it("accepts a name, street, and Accra area", () => {
    expect(
      addBuildingSchema.parse({
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
      })
    ).toEqual({
      name: "Ridge Court",
      street: "14 Ridge Road",
      area: "Cantonments",
    });
  });

  it("requires a full name when adding a new owner", () => {
    const result = addBuildingSchema.safeParse({
      name: "Ridge Court",
      street: "14 Ridge Road",
      area: "Cantonments",
      ownerChoice: NEW_OWNER_CHOICE,
      displayName: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a blank name", () => {
    const result = addBuildingSchema.safeParse({
      name: "   ",
      street: "14 Ridge Road",
      area: "Cantonments",
    });
    expect(result.success).toBe(false);
  });
});
