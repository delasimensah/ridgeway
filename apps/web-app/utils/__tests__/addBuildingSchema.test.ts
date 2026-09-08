import { addBuildingSchema } from "../addBuildingSchema";

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

  it("rejects a blank name", () => {
    const result = addBuildingSchema.safeParse({
      name: "   ",
      street: "14 Ridge Road",
      area: "Cantonments",
    });
    expect(result.success).toBe(false);
  });
});
