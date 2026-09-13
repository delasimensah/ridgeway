import { fireEvent, render, screen } from "@testing-library/react-native";

import JobStatusOption from "./JobStatusOption";

describe("JobStatusOption", () => {
  it("marks the current status as selected", () => {
    const onPress = jest.fn();
    render(
      <JobStatusOption
        status="assigned"
        label="Current status"
        selected
        onPress={onPress}
      />
    );
    expect(screen.getByText("Current status")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Current status"));
    expect(onPress).toHaveBeenCalled();
  });
});
