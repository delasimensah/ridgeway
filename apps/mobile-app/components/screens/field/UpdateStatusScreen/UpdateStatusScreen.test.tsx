import { fireEvent, render, screen } from "@testing-library/react-native";

import UpdateStatusScreen from "./UpdateStatusScreen";

describe("UpdateStatusScreen", () => {
  it("saves the selected next status", () => {
    const onSave = jest.fn();
    render(
      <UpdateStatusScreen
        currentStatus="assigned"
        options={["assigned", "scheduled"]}
        selected="scheduled"
        isSaving={false}
        onSelect={() => undefined}
        onSave={onSave}
        onClose={() => undefined}
      />
    );
    fireEvent.press(screen.getByText("Save status"));
    expect(onSave).toHaveBeenCalled();
  });
});
