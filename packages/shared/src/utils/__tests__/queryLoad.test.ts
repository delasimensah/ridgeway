import {
  firstQueryError,
  isNotPermittedError,
  screenLoadState,
} from "../queryLoad";

describe("screenLoadState", () => {
  it("treats a refusal as failed, not as still loading", () => {
    expect(
      screenLoadState([
        { isPending: false, isError: true },
        { isPending: true, isError: false },
      ])
    ).toBe("failed");
  });
});

describe("firstQueryError", () => {
  it("returns the first query that failed", () => {
    const error = new Error("Could not load");
    expect(
      firstQueryError([
        { isPending: false, isError: false },
        { isPending: false, isError: true, error },
      ])
    ).toBe(error);
  });
});

describe("isNotPermittedError", () => {
  it("reads NOT_PERMITTED from Convex error data", () => {
    expect(
      isNotPermittedError({
        data: { code: "NOT_PERMITTED", message: "NOT_PERMITTED" },
      })
    ).toBe(true);
    expect(
      isNotPermittedError({
        data: { code: "INVALID", message: "Name is required" },
      })
    ).toBe(false);
  });
});
