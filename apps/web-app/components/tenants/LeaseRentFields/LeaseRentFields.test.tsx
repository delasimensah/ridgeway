import { rentDueDayDescription } from "./LeaseRentFields";

describe("rentDueDayDescription", () => {
  it("explains the monthly rule when no day is set", () => {
    expect(rentDueDayDescription("")).toBe(
      "Rent falls due on this day every month."
    );
  });

  it("shows a concrete month example for a valid day", () => {
    expect(rentDueDayDescription("5")).toBe(
      "For example, September rent is due 5 Sep."
    );
  });
});
