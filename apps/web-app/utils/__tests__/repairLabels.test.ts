import {
  formatRepairDate,
  repairCategoryLabel,
  repairEventTitle,
  repairStatusLabel,
  repairUrgencyLabel,
} from "../repairLabels";

describe("repairLabels", () => {
  it("labels stored urgency normal as Medium", () => {
    expect(repairUrgencyLabel("normal")).toBe("Medium");
    expect(repairUrgencyLabel("high")).toBe("High");
  });

  it("labels statuses and events", () => {
    expect(repairStatusLabel("received")).toBe("Received");
    expect(repairEventTitle("received")).toBe("Repair received");
    expect(repairCategoryLabel("plumbing")).toBe("Plumbing");
    expect(repairCategoryLabel(null)).toBe("—");
  });

  it("formats a reported timestamp", () => {
    const noon = new Date(2026, 7, 22, 12).getTime();
    expect(formatRepairDate(noon)).toMatch(/Aug 2026/);
  });
});
