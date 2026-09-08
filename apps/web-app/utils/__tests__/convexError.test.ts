import { getConvexErrorInfo, getConvexErrorMessage } from "../convexError";

describe("getConvexErrorInfo", () => {
  it("reads code and message from ConvexError data", () => {
    expect(
      getConvexErrorInfo({
        data: {
          code: "INVALID",
          message: "Lease start must be today or earlier",
        },
      })
    ).toEqual({
      code: "INVALID",
      message: "Lease start must be today or earlier",
    });
  });

  it("parses a ConvexError payload from an Error message", () => {
    expect(
      getConvexErrorInfo(
        new Error(
          'Uncaught ConvexError: {"code":"INVALID","message":"Lease start must be today or earlier"}'
        )
      )
    ).toEqual({
      code: "INVALID",
      message: "Lease start must be today or earlier",
    });
  });
});

describe("getConvexErrorMessage", () => {
  it("returns the fallback when the error has no message", () => {
    expect(getConvexErrorMessage(null, "Could not save this tenant.")).toBe(
      "Could not save this tenant."
    );
  });
});
