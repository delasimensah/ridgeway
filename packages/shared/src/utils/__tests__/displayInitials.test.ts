import { getDisplayInitials } from "../displayInitials";

describe("getDisplayInitials", () => {
  it("uses the first and last name", () => {
    expect(getDisplayInitials("Ama Boateng")).toBe("AB");
  });

  it("uses the first two letters of a single name", () => {
    expect(getDisplayInitials("Ama")).toBe("AM");
  });

  it("ignores extra spaces", () => {
    expect(getDisplayInitials("  Akosua   Darko  ")).toBe("AD");
  });
});
