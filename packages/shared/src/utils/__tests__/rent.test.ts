import {
  formatMoney,
  formatMonthName,
  formatPeriodLabel,
  getRentDisplayStatus,
  periodLabelForYear,
  rentStatusLabel,
  shiftPeriodLabel,
  toSmallestUnit,
  yearsInPeriodRange,
} from "../rent";

describe("getRentDisplayStatus", () => {
  const serverNow = Date.UTC(2026, 8, 13);

  it("returns paid when staff confirmed paid", () => {
    expect(
      getRentDisplayStatus(
        { confirmedStatus: "paid", dueOn: "2026-09-05" },
        serverNow
      )
    ).toBe("paid");
  });

  it("returns partial when staff confirmed a partial payment", () => {
    expect(
      getRentDisplayStatus(
        { confirmedStatus: "partial", dueOn: "2026-09-05" },
        serverNow
      )
    ).toBe("partial");
  });

  it("returns late when unpaid and the due date has passed", () => {
    expect(
      getRentDisplayStatus(
        { confirmedStatus: "unpaid", dueOn: "2026-09-05" },
        serverNow
      )
    ).toBe("late");
  });

  it("returns due when unpaid and the due date has not passed", () => {
    expect(
      getRentDisplayStatus(
        { confirmedStatus: "unpaid", dueOn: "2026-09-25" },
        serverNow
      )
    ).toBe("due");
  });

  it("returns due on the due date itself", () => {
    expect(
      getRentDisplayStatus(
        { confirmedStatus: "unpaid", dueOn: "2026-09-13" },
        serverNow
      )
    ).toBe("due");
  });
});

describe("formatMoney", () => {
  it("formats whole cedis with the Ghana symbol", () => {
    expect(formatMoney(450000, "GHS")).toBe("GH₵ 4,500");
  });

  it("formats pesewas with two decimal places", () => {
    expect(formatMoney(125075, "GHS")).toBe("GH₵ 1,250.75");
  });
});

describe("toSmallestUnit", () => {
  it("stores whole cedis as pesewas", () => {
    expect(toSmallestUnit(4500)).toBe(450000);
  });
});

describe("formatPeriodLabel", () => {
  it("turns a stored month into a full month name", () => {
    expect(formatPeriodLabel("2026-09")).toBe("September 2026");
  });
});

describe("formatMonthName", () => {
  it("returns the month without the year", () => {
    expect(formatMonthName("2026-09")).toBe("September");
  });
});

describe("shiftPeriodLabel", () => {
  it("moves back and forward across a year boundary", () => {
    expect(shiftPeriodLabel("2026-01", -1)).toBe("2025-12");
    expect(shiftPeriodLabel("2025-12", 1)).toBe("2026-01");
  });
});

describe("yearsInPeriodRange", () => {
  it("lists each year from earliest charge through the current month", () => {
    expect(yearsInPeriodRange("2024-11", "2026-03")).toEqual([
      "2024",
      "2025",
      "2026",
    ]);
  });
});

describe("periodLabelForYear", () => {
  it("keeps the month when it falls inside the charged range", () => {
    expect(periodLabelForYear("2026-09", 2025, "2025-07", "2026-09")).toBe(
      "2025-09"
    );
  });

  it("clamps to the earliest month in that year when needed", () => {
    expect(periodLabelForYear("2026-03", 2025, "2025-07", "2026-09")).toBe(
      "2025-07"
    );
  });

  it("clamps to the latest allowed month in that year when needed", () => {
    expect(periodLabelForYear("2025-11", 2026, "2025-07", "2026-09")).toBe(
      "2026-09"
    );
  });
});

describe("rentStatusLabel", () => {
  it("labels the four displayed statuses", () => {
    expect(rentStatusLabel("paid")).toBe("Paid");
    expect(rentStatusLabel("due")).toBe("Due");
    expect(rentStatusLabel("late")).toBe("Late");
    expect(rentStatusLabel("partial")).toBe("Partial");
  });
});
