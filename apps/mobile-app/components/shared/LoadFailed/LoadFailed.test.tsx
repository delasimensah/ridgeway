import { fireEvent, render, screen } from "@testing-library/react-native";

import LoadFailed from "./LoadFailed";

describe("LoadFailed", () => {
  it("shows a short error and retries", () => {
    const onRetry = jest.fn();
    render(<LoadFailed message="Couldn't load jobs." onRetry={onRetry} />);

    expect(screen.getByText("Couldn't load jobs.")).toBeTruthy();
    fireEvent.press(screen.getByText("Try again"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
