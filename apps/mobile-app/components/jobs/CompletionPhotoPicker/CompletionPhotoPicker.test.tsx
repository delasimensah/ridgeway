import { render, screen } from "@testing-library/react-native";

import CompletionPhotoPicker from "./CompletionPhotoPicker";

describe("CompletionPhotoPicker", () => {
  it("shows the add photo prompt", () => {
    render(<CompletionPhotoPicker uri={null} onPress={() => undefined} />);
    expect(screen.getByText("Add completion photo")).toBeTruthy();
  });
});
