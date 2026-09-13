import { describe, expect, it } from "vitest";

import {
  isCalendarDate,
  isLeaseCurrent,
  latestEndedLease,
  previousCalendarDate,
} from "./viewer";

describe("isLeaseCurrent", () => {
  it("is current when there is no end date", () => {
    expect(isLeaseCurrent({}, "2026-09-08")).toBe(true);
  });

  it("is current when the end date is today or later", () => {
    expect(isLeaseCurrent({ endedOn: "2026-09-08" }, "2026-09-08")).toBe(true);
    expect(isLeaseCurrent({ endedOn: "2027-12-31" }, "2026-09-08")).toBe(true);
  });

  it("is not current when the end date is before today", () => {
    expect(isLeaseCurrent({ endedOn: "2026-09-07" }, "2026-09-08")).toBe(false);
  });
});

describe("previousCalendarDate", () => {
  it("returns the UTC day before", () => {
    expect(previousCalendarDate("2026-09-08")).toBe("2026-09-07");
    expect(previousCalendarDate("2026-01-01")).toBe("2025-12-31");
  });
});

describe("latestEndedLease", () => {
  it("returns the lease with the latest end date", () => {
    expect(
      latestEndedLease(
        [{ endedOn: "2025-01-01" }, { endedOn: "2026-06-01" }, {}],
        "2026-09-08"
      )
    ).toEqual({ endedOn: "2026-06-01" });
  });
});

describe("isCalendarDate", () => {
  it("accepts a real calendar day", () => {
    expect(isCalendarDate("2024-01-15")).toBe(true);
  });

  it("rejects an impossible day", () => {
    expect(isCalendarDate("2024-02-30")).toBe(false);
    expect(isCalendarDate("15/01/2024")).toBe(false);
  });
});
