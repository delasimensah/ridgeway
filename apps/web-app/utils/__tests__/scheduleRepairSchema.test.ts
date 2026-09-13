import { scheduleRepairSchema } from "../scheduleRepairSchema";

describe("scheduleRepairSchema", () => {
  it("requires a date", () => {
    const result = scheduleRepairSchema.safeParse({ scheduledFor: "" });
    expect(result.success).toBe(false);
  });
});
