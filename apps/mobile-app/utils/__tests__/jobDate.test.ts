import { formatJobsHeadingDate } from "../jobDate";

describe("formatJobsHeadingDate", () => {
  it("formats a weekday and date", () => {
    expect(formatJobsHeadingDate(new Date(2026, 8, 13))).toBe("Sunday, 13 Sep");
  });
});
