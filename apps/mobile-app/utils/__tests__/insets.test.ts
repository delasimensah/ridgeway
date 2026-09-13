import { bottomSafePad } from "../insets";

describe("bottomSafePad", () => {
  it("keeps Android content above a 3-button nav bar", () => {
    expect(bottomSafePad(0, "android")).toBe(48);
    expect(bottomSafePad(24, "ios")).toBe(24);
  });
});
