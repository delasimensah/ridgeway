import { fileRepairSchema } from "../fileRepairSchema";

describe("fileRepairSchema", () => {
  it("accepts a description, category, and urgency", () => {
    expect(
      fileRepairSchema.parse({
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      })
    ).toEqual({
      description: "Kitchen tap leak",
      category: "plumbing",
      urgency: "normal",
    });
  });

  it("rejects a blank description", () => {
    const result = fileRepairSchema.safeParse({
      description: "   ",
      category: "plumbing",
      urgency: "normal",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing category", () => {
    const result = fileRepairSchema.safeParse({
      description: "Kitchen tap leak",
      category: "",
      urgency: "normal",
    });
    expect(result.success).toBe(false);
  });
});
