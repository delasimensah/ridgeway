import { assignRepairSchema } from "../assignRepairSchema";

describe("assignRepairSchema", () => {
  it("requires a field worker", () => {
    const result = assignRepairSchema.safeParse({ assigneeProfileId: "" });
    expect(result.success).toBe(false);
  });
});
