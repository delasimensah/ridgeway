import { render, screen } from "@testing-library/react-native";

import CompletionPhotoScreen from "./CompletionPhotoScreen";

describe("CompletionPhotoScreen", () => {
  it("asks for a completion photo", () => {
    render(
      <CompletionPhotoScreen
        uri={null}
        caption=""
        isSaving={false}
        error={null}
        onChangeCaption={() => undefined}
        onPickPhoto={() => undefined}
        onSave={() => undefined}
        onBack={() => undefined}
      />
    );
    expect(screen.getByText("Add completion photo")).toBeTruthy();
    expect(screen.getByText("Save photo")).toBeTruthy();
  });
});
