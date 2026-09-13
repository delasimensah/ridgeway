import { getConvexErrorMessage } from "../convexError";

describe("getConvexErrorMessage", () => {
  it("reads a Convex error message", () => {
    expect(
      getConvexErrorMessage({
        data: { message: "That status change is not allowed" },
      })
    ).toBe("That status change is not allowed");
  });
});
