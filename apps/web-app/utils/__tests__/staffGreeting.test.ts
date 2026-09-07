import staffGreeting from "../staffGreeting";

describe("staffGreeting", () => {
  it("uses the first name and morning hours", () => {
    expect(staffGreeting("Ama Boateng", new Date("2026-09-07T08:00:00"))).toBe(
      "Good morning, Ama"
    );
  });

  it("uses afternoon hours", () => {
    expect(staffGreeting("Ama Boateng", new Date("2026-09-07T14:00:00"))).toBe(
      "Good afternoon, Ama"
    );
  });

  it("uses evening hours", () => {
    expect(staffGreeting("Yaw Darko", new Date("2026-09-07T19:00:00"))).toBe(
      "Good evening, Yaw"
    );
  });
});
