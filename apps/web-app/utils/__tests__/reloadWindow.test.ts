import { reloadWindow } from "../reloadWindow";

describe("reloadWindow", () => {
  it("reloads the current page", () => {
    const reload = jest.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload },
    });

    reloadWindow();

    expect(reload).toHaveBeenCalledTimes(1);
  });
});
