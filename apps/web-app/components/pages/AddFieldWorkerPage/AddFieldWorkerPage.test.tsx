import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import AddFieldWorkerPage from "./AddFieldWorkerPage";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("convex/react", () => ({
  useMutation: () => jest.fn(),
  useAction: () => jest.fn(),
}));

describe("AddFieldWorkerPage", () => {
  it("shows the add field worker form", () => {
    render(<AddFieldWorkerPage />);

    expect(
      screen.getByRole("heading", { name: "Add field worker" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Field" })).toHaveAttribute(
      "href",
      "/field"
    );
    expect(
      screen.getByRole("textbox", { name: /^full name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save field worker" })
    ).toBeInTheDocument();
  });

  it("fills the form when a saved field worker is opened", () => {
    render(
      <AddFieldWorkerPage
        profileId={"profile-id" as never}
        initialValues={{
          displayName: "Kofi Asante",
          email: "kofi.asante@ridgeway.gh",
          password: "",
        }}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Edit field worker" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /^full name/i })).toHaveValue(
      "Kofi Asante"
    );
    expect(screen.getByRole("textbox", { name: /^email/i })).toHaveValue(
      "kofi.asante@ridgeway.gh"
    );
  });
});
