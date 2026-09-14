import {
  formatMoney,
  formatPeriodLabel,
  getRentDisplayStatus,
  rentStatusLabel,
  toSmallestUnit,
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

describe("rentStatusLabel", () => {
  it("labels the four displayed statuses", () => {
    expect(rentStatusLabel("paid")).toBe("Paid");
    expect(rentStatusLabel("due")).toBe("Due");
    expect(rentStatusLabel("late")).toBe("Late");
    expect(rentStatusLabel("partial")).toBe("Partial");
  });
});
