import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import LoadFailed from "./LoadFailed";

describe("LoadFailed", () => {
  it("shows a short error and retries", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    render(<LoadFailed title="Couldn't load repairs." onRetry={onRetry} />);

    expect(
      screen.getByRole("heading", { name: "Couldn't load repairs." })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
