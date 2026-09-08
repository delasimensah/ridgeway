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
});
